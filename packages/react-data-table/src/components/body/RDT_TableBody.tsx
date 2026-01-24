import { memo, type HTMLAttributes, useMemo } from 'react';
import { type VirtualItem } from '@tanstack/react-virtual';
import clsx from 'clsx';
import { useRDT_RowVirtualizer } from '../../hooks/useRDT_RowVirtualizer';
import { useRDT_Rows } from '../../hooks/useRDT_Rows';
import {
  type RDT_ColumnVirtualizer,
  type RDT_Row,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { Memo_RDT_TableBodyRow, RDT_TableBodyRow } from './RDT_TableBodyRow';
import styles from '../table/table.module.css';

export interface RDT_TableBodyProps<TData extends RDT_RowData>
  extends HTMLAttributes<HTMLTableSectionElement> {
  columnVirtualizer?: RDT_ColumnVirtualizer;
  table: RDT_TableInstance<TData>;
}

export const RDT_TableBody = <TData extends RDT_RowData>({
  columnVirtualizer,
  table,
  className,
  ...rest
}: RDT_TableBodyProps<TData>) => {
  const {
    getBottomRows,
    getIsSomeRowsPinned,
    getRowModel,
    getState,
    getTopRows,
    options: {
      enableStickyFooter,
      enableStickyHeader,
      layoutMode,
      localization,
      memoMode,
      renderDetailPanel,
      renderEmptyRowsFallback,
      rowPinningDisplayMode,
      tableBodyProps,
    },
    refs: { tableFooterRef, tableHeadRef, tablePaperRef },
  } = table;
  const { columnFilters, globalFilter, isFullScreen, rowPinning } = getState();

  const tbodyProps = {
    ...parseFromValuesOrFunc(tableBodyProps, { table }),
    ...rest,
  };

  const tableHeadHeight =
    ((enableStickyHeader || isFullScreen) &&
      tableHeadRef.current?.clientHeight) ||
    0;
  const tableFooterHeight =
    (enableStickyFooter && tableFooterRef.current?.clientHeight) || 0;

  const pinnedRowIds = useMemo(() => {
    if (!rowPinning.bottom?.length && !rowPinning.top?.length) return [];
    return getRowModel()
      .rows.filter((row) => row.getIsPinned())
      .map((r) => r.id);
  }, [rowPinning, getRowModel]);

  const rows = useRDT_Rows(table);

  const rowVirtualizer = useRDT_RowVirtualizer(table, rows);

  const { virtualRows } = rowVirtualizer ?? {};

  const commonRowProps = {
    columnVirtualizer,
    numRows: rows.length,
    table,
  };

  return (
    <>
      {/* Top pinned rows */}
      {!rowPinningDisplayMode?.includes('sticky') &&
        getIsSomeRowsPinned('top') && (
          <tbody
            {...tbodyProps}
            className={clsx(
              styles.tableBody,
              styles.tableBodyPinnedTop,
              layoutMode?.startsWith('grid') && styles.tableLayoutGrid,
              tbodyProps?.className,
            )}
            style={{
              position: 'sticky',
              top: tableHeadHeight - 1,
              zIndex: 1,
              ...tbodyProps?.style,
            }}
          >
            {getTopRows().map((row, staticRowIndex) => (
              <RDT_TableBodyRow
                key={row.id}
                {...commonRowProps}
                row={row as RDT_Row<TData>}
                staticRowIndex={staticRowIndex}
              />
            ))}
          </tbody>
        )}

      {/* Main body */}
      <tbody
        {...tbodyProps}
        className={clsx(
          styles.tableBody,
          layoutMode?.startsWith('grid') && styles.tableLayoutGrid,
          tbodyProps?.className,
          className,
        )}
        style={{
          height: rowVirtualizer
            ? `${rowVirtualizer.getTotalSize()}px`
            : undefined,
          minHeight: !rows.length ? '100px' : undefined,
          position: 'relative',
          ...tbodyProps?.style,
        }}
      >
        {!rows.length ? (
          <tr
            className={clsx(
              styles.emptyRow,
              layoutMode?.startsWith('grid') && styles.tableLayoutGrid,
            )}
          >
            <td
              colSpan={table.getVisibleLeafColumns().length}
              className={styles.emptyCell}
              style={{
                maxWidth: tablePaperRef.current?.clientWidth
                  ? `${tablePaperRef.current.clientWidth}px`
                  : '100%',
              }}
            >
              {renderEmptyRowsFallback?.({ table }) ?? (
                <span>
                  {globalFilter || columnFilters.length
                    ? localization.noResultsFound
                    : localization.noRecordsToDisplay}
                </span>
              )}
            </td>
          </tr>
        ) : (
          (virtualRows ?? rows).map((rowOrVirtualRow, staticRowIndex) => {
            let row = rowOrVirtualRow as RDT_Row<TData>;
            if (rowVirtualizer) {
              if (renderDetailPanel) {
                if (rowOrVirtualRow.index % 2 === 1) {
                  return null;
                } else {
                  staticRowIndex = rowOrVirtualRow.index / 2;
                }
              } else {
                staticRowIndex = rowOrVirtualRow.index;
              }
              row = rows[staticRowIndex];
            }
            const props = {
              ...commonRowProps,
              pinnedRowIds,
              row,
              rowVirtualizer,
              staticRowIndex,
              virtualRow: rowVirtualizer
                ? (rowOrVirtualRow as VirtualItem)
                : undefined,
            };
            const key = `${row.id}-${row.index}`;
            return memoMode === 'rows' ? (
              <Memo_RDT_TableBodyRow key={key} {...props} />
            ) : (
              <RDT_TableBodyRow key={key} {...props} />
            );
          })
        )}
      </tbody>

      {/* Bottom pinned rows */}
      {!rowPinningDisplayMode?.includes('sticky') &&
        getIsSomeRowsPinned('bottom') && (
          <tbody
            {...tbodyProps}
            className={clsx(
              styles.tableBody,
              styles.tableBodyPinnedBottom,
              layoutMode?.startsWith('grid') && styles.tableLayoutGrid,
              tbodyProps?.className,
            )}
            style={{
              position: 'sticky',
              bottom: tableFooterHeight - 1,
              zIndex: 1,
              ...tbodyProps?.style,
            }}
          >
            {getBottomRows().map((row, staticRowIndex) => (
              <RDT_TableBodyRow
                key={row.id}
                {...commonRowProps}
                row={row as RDT_Row<TData>}
                staticRowIndex={staticRowIndex}
              />
            ))}
          </tbody>
        )}
    </>
  );
};

export const Memo_RDT_TableBody = memo(
  RDT_TableBody,
  (prev, next) => prev.table.options.data === next.table.options.data,
) as typeof RDT_TableBody;
