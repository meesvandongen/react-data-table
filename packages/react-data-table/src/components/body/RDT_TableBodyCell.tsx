import {
  type MouseEvent,
  type TdHTMLAttributes,
  useEffect,
  useState,
} from 'react';
import clsx from 'clsx';
import {
  type RDT_Cell,
  type RDT_Row,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import { getRDT_CellWidthStyles } from '../../utils/style.utils';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { RDT_CopyButton } from '../buttons/RDT_CopyButton';
import { RDT_EditCellTextField } from '../inputs/RDT_EditCellTextField';
import { RDT_Skeleton } from './RDT_Skeleton';
import { RDT_TableBodyCellValue } from './RDT_TableBodyCellValue';
import styles from '../table/table.module.css';

export interface RDT_TableBodyCellProps<TData extends RDT_RowData>
  extends TdHTMLAttributes<HTMLTableCellElement> {
  cell: RDT_Cell<TData>;
  isRowHovered?: boolean;
  numRows?: number;
  row: RDT_Row<TData>;
  rowDropPosition?: 'before' | 'after' | null;
  rowRef?: React.RefObject<HTMLTableRowElement | null>;
  staticColumnIndex?: number;
  staticRowIndex: number;
  table: RDT_TableInstance<TData>;
}

export const RDT_TableBodyCell = <TData extends RDT_RowData>({
  cell,
  isRowHovered,
  row,
  rowDropPosition,
  rowRef,
  staticColumnIndex,
  staticRowIndex,
  table,
  className,
  style,
  ...rest
}: RDT_TableBodyCellProps<TData>) => {
  const { column } = cell;
  const { columnDef } = column;
  const {
    getState,
    options: {
      createDisplayMode,
      editDisplayMode,
      enableCellActions,
      enableClickToCopy,
      enableColumnOrdering,
      layoutMode,
      tableCellProps,
    },
    refs: { actionCellRef },
    setActionCell,
  } = table;
  const {
    actionCell,
    creatingRow,
    density,
    draggingColumn,
    editingCell,
    editingRow,
    isLoading,
    showSkeletons,
  } = getState();

  // Skeleton width calculation similar to MRT
  const [skeletonWidth, setSkeletonWidth] = useState(100);
  useEffect(() => {
    if ((!isLoading && !showSkeletons) || skeletonWidth !== 100) return;
    const size = column.getSize();
    setSkeletonWidth(
      columnDef.columnDefType === 'display'
        ? size / 2
        : Math.round(Math.random() * (size - size / 3) + size / 3),
    );
  }, [isLoading, showSkeletons]);

  // Determine if skeleton should be shown
  const shouldShowSkeleton =
    showSkeletons !== false && (isLoading || showSkeletons);

  const cellProps = {
    ...parseFromValuesOrFunc(tableCellProps, { cell, column, row, table }),
    ...parseFromValuesOrFunc(columnDef.tableCellProps, {
      cell,
      column,
      row,
      table,
    }),
    ...rest,
  };

  const isPinned = column.getIsPinned();
  const isEditable =
    parseFromValuesOrFunc(columnDef.enableEditing, row) !== false;

  // Detect if this column is the last left-pinned or first right-pinned (for shadow)
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left');
  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right');

  const isCreating = creatingRow?.id === row.id;
  const isEditing = editingRow?.id === row.id || editingCell?.id === cell.id;

  const showEditField =
    isEditable &&
    (isCreating || isEditing) &&
    !['custom', 'modal'].includes(
      (isCreating ? createDisplayMode : editDisplayMode) as string,
    );

  const isDraggingColumn = draggingColumn?.id === column.id;
  const isHoveredColumn =
    enableColumnOrdering &&
    draggingColumn?.id !== column.id &&
    row.getIsSelected();

  const isRightClickable = parseFromValuesOrFunc(enableCellActions, cell);
  const isActionCellActive = actionCell?.id === cell.id;

  // Match MRT behavior for column type styling
  const { columnDefType } = columnDef;
  const isDataColumn = columnDefType !== 'display';

  // Match MRT: nowrap when row is pinned or density is compact, otherwise normal
  const shouldNoWrap = row.getIsPinned() || density === 'compact';

  const showClickToCopyButton =
    (parseFromValuesOrFunc(enableClickToCopy, cell) === true ||
      parseFromValuesOrFunc(columnDef.enableClickToCopy, cell) === true) &&
    !['context-menu', false].includes(
      parseFromValuesOrFunc(columnDef.enableClickToCopy, cell) as
        | 'context-menu'
        | boolean,
    );

  const handleContextMenu = (e: MouseEvent<HTMLTableCellElement>) => {
    cellProps?.onContextMenu?.(e);
    if (isRightClickable) {
      e.preventDefault();
      setActionCell(cell);
      actionCellRef.current = e.currentTarget;
    }
  };

  // Get the pinned position offset
  const pinnedOffset =
    isPinned === 'left'
      ? column.getStart('left')
      : isPinned === 'right'
        ? column.getAfter('right')
        : undefined;

  return (
    <td
      {...cellProps}
      data-pinned={isPinned || undefined}
      onContextMenu={handleContextMenu}
      className={clsx(
        styles.tableBodyCell,
        layoutMode?.startsWith('grid') && styles.tableLayoutGridCell,
        isPinned && styles.tableBodyCellPinned,
        isPinned === 'left' && styles.tableBodyCellPinnedLeft,
        isPinned === 'right' && styles.tableBodyCellPinnedRight,
        isLastLeftPinnedColumn && styles.tableBodyCellPinnedLeftLast,
        isFirstRightPinnedColumn && styles.tableBodyCellPinnedRightFirst,
        showEditField && styles.tableBodyCellEditing,
        isDraggingColumn && styles.tableBodyCellDragging,
        isHoveredColumn && styles.tableBodyCellHovered,
        isRightClickable && styles.tableBodyCellRightClickable,
        isActionCellActive && styles.tableBodyCellActionActive,
        isDataColumn && styles.tableBodyCellTruncate,
        shouldNoWrap ? styles.tableBodyCellNoWrap : styles.tableBodyCellWrap,
        isRowHovered &&
          rowDropPosition === 'before' &&
          styles.tableBodyCellDropZoneBefore,
        isRowHovered &&
          rowDropPosition === 'after' &&
          styles.tableBodyCellDropZoneAfter,
        cellProps?.className,
        className,
      )}
      style={{
        ...getRDT_CellWidthStyles({ column, table }),
        maxWidth: columnDef.maxSize,
        ...(isPinned && {
          [isPinned === 'left'
            ? '--rdt-pinned-left-offset'
            : '--rdt-pinned-right-offset']: `${pinnedOffset}px`,
        }),
        ...cellProps?.style,
        ...style,
      }}
    >
      {cell.getIsPlaceholder() ? (
        (columnDef.PlaceholderCell?.({ cell, column, row, table }) ?? null)
      ) : shouldShowSkeleton ? (
        <RDT_Skeleton width={skeletonWidth} />
      ) : showEditField ? (
        <RDT_EditCellTextField cell={cell} table={table} />
      ) : columnDefType === 'display' &&
        (['rdt-row-expand', 'rdt-row-numbers', 'rdt-row-select'].includes(
          column.id,
        ) ||
          !row.getIsGrouped()) ? (
        columnDef.Cell?.({
          cell,
          column,
          renderedCellValue: cell.renderValue() as any,
          row,
          rowRef,
          staticColumnIndex,
          staticRowIndex,
          table,
        })
      ) : showClickToCopyButton ? (
        <RDT_CopyButton cell={cell} table={table}>
          <RDT_TableBodyCellValue
            cell={cell}
            rowRef={rowRef}
            staticColumnIndex={staticColumnIndex}
            staticRowIndex={staticRowIndex}
            table={table}
          />
        </RDT_CopyButton>
      ) : (
        <RDT_TableBodyCellValue
          cell={cell}
          rowRef={rowRef}
          staticColumnIndex={staticColumnIndex}
          staticRowIndex={staticRowIndex}
          table={table}
        />
      )}
      {cell.getIsGrouped() && !columnDef.GroupedCell && (
        <> ({row.subRows?.length})</>
      )}
    </td>
  );
};
