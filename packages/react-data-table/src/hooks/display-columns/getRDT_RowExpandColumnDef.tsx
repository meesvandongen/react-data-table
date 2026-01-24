import { type ReactNode } from 'react';
import { RDT_ExpandAllButton } from '../../components/buttons/RDT_ExpandAllButton';
import { RDT_ExpandButton } from '../../components/buttons/RDT_ExpandButton';
import {
  type RDT_ColumnDef,
  type RDT_RowData,
  type RDT_StatefulTableOptions,
} from '../../types';
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils';

export const getRDT_RowExpandColumnDef = <TData extends RDT_RowData>(
  tableOptions: RDT_StatefulTableOptions<TData>,
): RDT_ColumnDef<TData> => {
  const {
    defaultColumn,
    enableExpandAll,
    groupedColumnMode,
    positionExpandColumn,
    renderDetailPanel,
    state: { grouping },
  } = tableOptions;

  const alignProps =
    positionExpandColumn === 'last'
      ? ({
          style: { textAlign: 'right' } as React.CSSProperties,
        } as const)
      : undefined;

  return {
    Cell: ({ cell, column, row, staticRowIndex, table }) => {
      const expandButtonProps = { row, staticRowIndex, table };
      const subRowsLength = row.subRows?.length;

      if (groupedColumnMode === 'remove' && row.groupingColumnId) {
        return (
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <RDT_ExpandButton {...expandButtonProps} />
            <span
              title={
                table.getColumn(row.groupingColumnId).columnDef.header as string
              }
            >
              {row.groupingValue as ReactNode}
            </span>
            {!!subRowsLength && <span>({subRowsLength})</span>}
          </div>
        );
      } else {
        return (
          <>
            <RDT_ExpandButton {...expandButtonProps} />
            {column.columnDef.GroupedCell?.({ cell, column, row, table })}
          </>
        );
      }
    },
    Header: enableExpandAll
      ? ({ table }) => {
          return (
            <>
              <RDT_ExpandAllButton table={table} />
              {groupedColumnMode === 'remove' &&
                grouping
                  ?.map(
                    (groupedColumnId) =>
                      table.getColumn(groupedColumnId).columnDef.header,
                  )
                  ?.join(', ')}
            </>
          );
        }
      : undefined,
    tableCellProps: alignProps,
    tableHeadCellProps: alignProps,
    ...defaultDisplayColumnProps({
      header: 'expand',
      id: 'rdt-row-expand',
      size:
        groupedColumnMode === 'remove'
          ? (defaultColumn?.size ?? 180)
          : renderDetailPanel
            ? enableExpandAll
              ? 60
              : 70
            : 100,
      tableOptions,
    }),
  };
};
