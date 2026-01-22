import { type ReactNode } from 'react';
import {
  type RDT_ColumnDef,
  type RDT_RowData,
  type RDT_StatefulTableOptions,
} from '../../types';
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils';

// TODO: Import actual components once built
// import { RDT_ExpandAllButton } from '../../components/buttons/RDT_ExpandAllButton';
// import { RDT_ExpandButton } from '../../components/buttons/RDT_ExpandButton';

export const getRDT_RowExpandColumnDef = <TData extends RDT_RowData>(
  tableOptions: RDT_StatefulTableOptions<TData>,
): RDT_ColumnDef<TData> => {
  const {
    defaultColumn,
    enableExpandAll,
    groupedColumnMode,
    icons,
    localization,
    positionExpandColumn,
    renderDetailPanel,
    state: { grouping },
  } = tableOptions;

  const ExpandIcon = icons.ExpandMoreIcon;
  const CollapseAllIcon = icons.KeyboardDoubleArrowDownIcon;

  const alignProps =
    positionExpandColumn === 'last'
      ? ({
          style: { textAlign: 'right' } as React.CSSProperties,
        } as const)
      : undefined;

  return {
    Cell: ({ cell, column, row, staticRowIndex: _staticRowIndex, table }) => {
      const isExpanded = row.getIsExpanded();
      const canExpand = row.getCanExpand() || renderDetailPanel;
      const subRowsLength = row.subRows?.length;

      // TODO: Replace with actual RDT_ExpandButton component once built
      const ExpandButton = () =>
        canExpand ? (
          <button
            type="button"
            aria-label={
              isExpanded ? localization.collapse : localization.expand
            }
            onClick={() => row.toggleExpanded()}
            style={{
              cursor: 'pointer',
              padding: '4px',
              background: 'none',
              border: 'none',
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          >
            <ExpandIcon />
          </button>
        ) : null;

      if (groupedColumnMode === 'remove' && row.groupingColumnId) {
        return (
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <ExpandButton />
            <span
              title={table.getColumn(row.groupingColumnId).columnDef.header}
            >
              {row.groupingValue as ReactNode}
            </span>
            {!!subRowsLength && <span>({subRowsLength})</span>}
          </div>
        );
      } else {
        return (
          <>
            <ExpandButton />
            {column.columnDef.GroupedCell?.({ cell, column, row, table })}
          </>
        );
      }
    },
    Header: enableExpandAll
      ? ({ table }) => {
          // TODO: Replace with actual RDT_ExpandAllButton component once built
          const allRowsExpanded = table.getIsAllRowsExpanded();
          return (
            <>
              <button
                type="button"
                aria-label={
                  allRowsExpanded
                    ? localization.collapseAll
                    : localization.expandAll
                }
                onClick={() => table.toggleAllRowsExpanded()}
                style={{
                  cursor: 'pointer',
                  padding: '4px',
                  background: 'none',
                  border: 'none',
                  transform: allRowsExpanded
                    ? 'rotate(180deg)'
                    : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}
              >
                <CollapseAllIcon />
              </button>
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
