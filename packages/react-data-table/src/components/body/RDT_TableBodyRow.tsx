import {
  memo,
  type DragEvent,
  type HTMLAttributes,
  useMemo,
  useRef,
} from 'react';
import clsx from 'clsx';
import {
  type RDT_Cell,
  type RDT_ColumnVirtualizer,
  type RDT_Row,
  type RDT_RowData,
  type RDT_RowVirtualizer,
  type RDT_TableInstance,
  type RDT_VirtualItem,
} from '../../types';
import { getIsRowSelected } from '../../utils/row.utils';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { RDT_TableBodyCell } from './RDT_TableBodyCell';
import { RDT_TableDetailPanel } from './RDT_TableDetailPanel';
import styles from '../table/table.module.css';

export interface RDT_TableBodyRowProps<TData extends RDT_RowData>
  extends HTMLAttributes<HTMLTableRowElement> {
  columnVirtualizer?: RDT_ColumnVirtualizer;
  numRows?: number;
  pinnedRowIds?: string[];
  row: RDT_Row<TData>;
  rowVirtualizer?: RDT_RowVirtualizer;
  staticRowIndex: number;
  table: RDT_TableInstance<TData>;
  virtualRow?: RDT_VirtualItem;
}

export const RDT_TableBodyRow = <TData extends RDT_RowData>({
  columnVirtualizer,
  numRows,
  pinnedRowIds,
  row,
  rowVirtualizer,
  staticRowIndex,
  table,
  virtualRow,
  className,
  style,
  ...rest
}: RDT_TableBodyRowProps<TData>) => {
  const {
    getState,
    options: {
      enableRowOrdering,
      enableRowPinning,
      enableStickyFooter,
      enableStickyHeader,
      layoutMode,
      tableRowProps,
      renderDetailPanel,
      rowPinningDisplayMode,
    },
    refs: { tableFooterRef, tableHeadRef },
    setHoveredRow,
    setHoveredRowDropPosition,
  } = table;

  const {
    density,
    draggingRow,
    hoveredRow,
    hoveredRowDropPosition,
    isFullScreen,
    rowPinning,
  } = getState();

  const visibleCells = row.getVisibleCells();

  const { virtualColumns, virtualPaddingLeft, virtualPaddingRight } =
    columnVirtualizer ?? {};

  const isRowSelected = getIsRowSelected({ row, table });
  const isRowPinned = enableRowPinning && row.getIsPinned();
  const isRowGrouped = row.getIsGrouped();
  const isDraggingRow = draggingRow?.id === row.id;
  const isHoveredRow = hoveredRow?.id === row.id;

  // Get drop position from table state (only relevant for the hovered row)
  const dropPosition = isHoveredRow ? hoveredRowDropPosition : null;

  const rowProps = {
    ...parseFromValuesOrFunc(tableRowProps, { row, staticRowIndex, table }),
    ...rest,
  };

  const [bottomPinnedIndex, topPinnedIndex] = useMemo(() => {
    if (
      !enableRowPinning ||
      !rowPinningDisplayMode?.includes('sticky') ||
      !pinnedRowIds ||
      !row.getIsPinned()
    )
      return [];
    return [
      [...pinnedRowIds].reverse().indexOf(row.id),
      pinnedRowIds.indexOf(row.id),
    ];
  }, [pinnedRowIds, rowPinning]);

  const tableHeadHeight =
    ((enableStickyHeader || isFullScreen) &&
      tableHeadRef?.current?.clientHeight) ||
    0;
  const tableFooterHeight =
    (enableStickyFooter && tableFooterRef?.current?.clientHeight) || 0;

  const defaultRowHeight =
    density === 'compact' ? 37 : density === 'comfortable' ? 53 : 69;

  const customRowHeight =
    parseInt(rowProps?.style?.height as string, 10) || undefined;

  const rowHeight = customRowHeight || defaultRowHeight;

  const handleDragEnter = (_e: DragEvent) => {
    if (enableRowOrdering && draggingRow) {
      setHoveredRow(row);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLTableRowElement>) => {
    e.preventDefault();
    if (enableRowOrdering && draggingRow && rowRef.current) {
      const rect = rowRef.current.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      const newPosition = e.clientY < midY ? 'before' : 'after';
      if (newPosition !== hoveredRowDropPosition) {
        setHoveredRowDropPosition(newPosition);
      }
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLTableRowElement>) => {
    // Only reset if we're actually leaving the row (not entering a child)
    const relatedTarget = e.relatedTarget as Node | null;
    if (rowRef.current && !rowRef.current.contains(relatedTarget)) {
      setHoveredRowDropPosition(null);
    }
  };

  const rowRef = useRef<HTMLTableRowElement | null>(null);

  // Show drop indicator when this row is being hovered during drag
  const showDropIndicator = isHoveredRow && draggingRow && !isDraggingRow;

  return (
    <>
      <tr
        data-index={renderDetailPanel ? staticRowIndex * 2 : staticRowIndex}
        data-pinned={!!isRowPinned || undefined}
        data-selected={isRowSelected || undefined}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        ref={(node: HTMLTableRowElement) => {
          if (node) {
            rowRef.current = node;
            rowVirtualizer?.measureElement(node);
          }
        }}
        {...rowProps}
        className={clsx(
          styles.tableBodyRow,
          isRowSelected && styles.tableBodyRowSelected,
          isRowPinned && styles.tableBodyRowPinned,
          isRowPinned === 'top' && styles.tableBodyRowPinnedTop,
          isRowPinned === 'bottom' && styles.tableBodyRowPinnedBottom,
          isRowGrouped && styles.tableBodyRowGrouped,
          isDraggingRow && styles.tableBodyRowDragging,
          layoutMode?.startsWith('grid') && styles.tableLayoutGrid,
          rowProps?.className,
          className,
        )}
        style={{
          transform: virtualRow
            ? `translateY(${virtualRow.start}px)`
            : undefined,
          position: virtualRow
            ? 'absolute'
            : rowPinningDisplayMode?.includes('sticky') && isRowPinned
              ? 'sticky'
              : 'relative',
          bottom:
            !virtualRow && bottomPinnedIndex !== undefined && isRowPinned
              ? `${
                  bottomPinnedIndex * rowHeight +
                  (enableStickyFooter ? tableFooterHeight - 1 : 0)
                }px`
              : undefined,
          top: virtualRow
            ? 0
            : topPinnedIndex !== undefined && isRowPinned
              ? `${
                  topPinnedIndex * rowHeight +
                  (enableStickyHeader || isFullScreen ? tableHeadHeight - 1 : 0)
                }px`
              : undefined,
          opacity: isRowPinned ? 0.97 : isDraggingRow ? 0.5 : 1,
          zIndex:
            rowPinningDisplayMode?.includes('sticky') && isRowPinned ? 2 : 0,
          width: '100%',
          ...rowProps?.style,
          ...style,
        }}
      >
        {virtualPaddingLeft ? (
          <td style={{ display: 'flex', width: virtualPaddingLeft }} />
        ) : null}
        {(virtualColumns ?? visibleCells).map(
          (cellOrVirtualCell, staticColumnIndex) => {
            let cell = cellOrVirtualCell as RDT_Cell<TData>;
            if (columnVirtualizer) {
              staticColumnIndex = (cellOrVirtualCell as RDT_VirtualItem).index;
              cell = visibleCells[staticColumnIndex];
            }
            const props = {
              cell,
              numRows,
              row,
              rowRef,
              staticColumnIndex,
              staticRowIndex,
              table,
              // Pass row drag info to cells for styling
              isRowHovered: isHoveredRow && !!draggingRow && !isDraggingRow,
              rowDropPosition: showDropIndicator ? dropPosition : null,
            };
            const key = `${cell.id}-${staticRowIndex}`;
            return cell ? <RDT_TableBodyCell key={key} {...props} /> : null;
          },
        )}
        {virtualPaddingRight ? (
          <td style={{ display: 'flex', width: virtualPaddingRight }} />
        ) : null}
      </tr>
      {renderDetailPanel && !row.getIsGrouped() && (
        <RDT_TableDetailPanel
          parentRowRef={rowRef}
          row={row}
          rowVirtualizer={rowVirtualizer}
          staticRowIndex={staticRowIndex}
          table={table}
          virtualRow={virtualRow}
        />
      )}
    </>
  );
};

export const Memo_RDT_TableBodyRow = memo(
  RDT_TableBodyRow,
  (prev, next) =>
    prev.row === next.row && prev.staticRowIndex === next.staticRowIndex,
) as typeof RDT_TableBodyRow;
