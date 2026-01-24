import { type ReactNode, type RefObject } from 'react';
import {
  type RDT_Cell,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import highlightWords from 'highlight-words';
import styles from '../table/table.module.css';

const allowedTypes = ['string', 'number'];

export interface RDT_TableBodyCellValueProps<TData extends RDT_RowData> {
  cell: RDT_Cell<TData>;
  rowRef?: RefObject<HTMLTableRowElement | null>;
  staticColumnIndex?: number;
  staticRowIndex?: number;
  table: RDT_TableInstance<TData>;
}

export const RDT_TableBodyCellValue = <TData extends RDT_RowData>({
  cell,
  rowRef,
  staticColumnIndex,
  staticRowIndex,
  table,
}: RDT_TableBodyCellValueProps<TData>) => {
  const {
    getState,
    options: { enableFilterMatchHighlighting, matchHighlightColor },
  } = table;
  const { column, row } = cell;
  const { columnDef } = column;
  const { globalFilter, globalFilterFn } = getState();
  const filterValue = column.getFilterValue();

  const isDisplayColumn = columnDef.columnDefType === 'display';

  let renderedCellValue =
    cell.getIsAggregated() && columnDef.AggregatedCell
      ? columnDef.AggregatedCell({
          cell,
          column,
          row,
          table,
          staticColumnIndex,
          staticRowIndex,
        })
      : row.getIsGrouped() && !cell.getIsGrouped() && !isDisplayColumn
        ? null
        : cell.getIsGrouped() && columnDef.GroupedCell
          ? columnDef.GroupedCell({
              cell,
              column,
              row,
              table,
              staticColumnIndex,
              staticRowIndex,
            })
          : undefined;

  const isGroupedValue = renderedCellValue !== undefined;

  if (!isGroupedValue) {
    renderedCellValue = cell.renderValue() as ReactNode | number | string;
  }

  if (
    enableFilterMatchHighlighting &&
    columnDef.enableFilterMatchHighlighting !== false &&
    String(renderedCellValue) &&
    allowedTypes.includes(typeof renderedCellValue) &&
    ((filterValue &&
      allowedTypes.includes(typeof filterValue) &&
      ['autocomplete', 'text'].includes(columnDef.filterVariant!)) ||
      (globalFilter &&
        allowedTypes.includes(typeof globalFilter) &&
        column.getCanGlobalFilter()))
  ) {
    const chunks = highlightWords?.({
      matchExactly:
        (filterValue ? columnDef._filterFn : globalFilterFn) !== 'fuzzy',
      query: (filterValue ?? globalFilter ?? '').toString(),
      text: renderedCellValue?.toString() as string,
    });
    if (chunks?.length > 1 || chunks?.[0]?.match) {
      renderedCellValue = (
        <span aria-label={renderedCellValue as string} role="note">
          {chunks?.map(({ key, match, text }) => (
            <span
              aria-hidden="true"
              key={key}
              className={match ? styles.matchHighlight : undefined}
              style={
                match && matchHighlightColor
                  ? { backgroundColor: matchHighlightColor }
                  : undefined
              }
            >
              {text}
            </span>
          )) ?? renderedCellValue}
        </span>
      );
    }
  }

  if (columnDef.Cell && !isGroupedValue) {
    renderedCellValue = columnDef.Cell({
      cell,
      column,
      renderedCellValue,
      row,
      rowRef,
      staticColumnIndex,
      staticRowIndex,
      table,
    } as any);
  }

  return renderedCellValue;
};
