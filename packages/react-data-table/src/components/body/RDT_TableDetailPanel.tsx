import { type RefObject, type TdHTMLAttributes } from 'react';
import clsx from 'clsx';
import {
  type RDT_Row,
  type RDT_RowData,
  type RDT_RowVirtualizer,
  type RDT_TableInstance,
  type RDT_VirtualItem,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import styles from '../table/table.module.css';

export interface RDT_TableDetailPanelProps<TData extends RDT_RowData>
  extends TdHTMLAttributes<HTMLTableCellElement> {
  parentRowRef: RefObject<HTMLTableRowElement | null>;
  row: RDT_Row<TData>;
  rowVirtualizer?: RDT_RowVirtualizer;
  staticRowIndex: number;
  table: RDT_TableInstance<TData>;
  virtualRow?: RDT_VirtualItem;
}

export const RDT_TableDetailPanel = <TData extends RDT_RowData>({
  parentRowRef,
  row,
  rowVirtualizer,
  staticRowIndex,
  table,
  virtualRow,
  className,
  style,
  ...rest
}: RDT_TableDetailPanelProps<TData>) => {
  const {
    getState,
    getVisibleLeafColumns,
    options: { layoutMode, detailPanelProps, tableRowProps, renderDetailPanel },
  } = table;
  const { isLoading } = getState();

  const rowProps = parseFromValuesOrFunc(tableRowProps, {
    isDetailPanel: true,
    row,
    staticRowIndex,
    table,
  });

  const cellProps = {
    ...parseFromValuesOrFunc(detailPanelProps, {
      row,
      table,
    }),
    ...rest,
  };

  const DetailPanel = !isLoading && renderDetailPanel?.({ row, table });

  const isExpanded = row.getIsExpanded();

  return (
    <tr
      data-index={renderDetailPanel ? staticRowIndex * 2 + 1 : staticRowIndex}
      ref={(node: HTMLTableRowElement) => {
        if (node) {
          rowVirtualizer?.measureElement?.(node);
        }
      }}
      {...rowProps}
      className={clsx(
        styles.detailPanel,
        layoutMode?.startsWith('grid') && styles.tableLayoutGridRow,
        rowProps?.className,
      )}
      style={{
        position: virtualRow ? 'absolute' : undefined,
        top: virtualRow
          ? `${parentRowRef.current?.getBoundingClientRect()?.height}px`
          : undefined,
        transform: virtualRow
          ? `translateY(${virtualRow?.start}px)`
          : undefined,
        width: '100%',
        ...rowProps?.style,
      }}
    >
      <td
        colSpan={getVisibleLeafColumns().length}
        {...cellProps}
        className={clsx(
          styles.detailPanelCell,
          !isExpanded && styles.detailPanelCellCollapsed,
          cellProps?.className,
          className,
        )}
        style={{
          display: layoutMode?.startsWith('grid') ? 'flex' : undefined,
          width: '100%',
          ...cellProps?.style,
          ...style,
        }}
      >
        {virtualRow ? (
          isExpanded && DetailPanel
        ) : (
          <div
            className={clsx(
              styles.detailPanelCollapse,
              isExpanded && styles.detailPanelCollapseOpen,
            )}
          >
            <div className={styles.detailPanelCollapseInner}>
              <div className={styles.detailPanelContent}>{DetailPanel}</div>
            </div>
          </div>
        )}
      </td>
    </tr>
  );
};
