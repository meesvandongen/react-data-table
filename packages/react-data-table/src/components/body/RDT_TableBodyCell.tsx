import { type TdHTMLAttributes } from 'react';
import clsx from 'clsx';
import {
  type RDT_Cell,
  type RDT_Row,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import { getRDT_CellWidthStyles } from '../../utils/style.utils';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { RDT_EditCellTextField } from '../inputs/RDT_EditCellTextField';
import { RDT_TableBodyCellValue } from './RDT_TableBodyCellValue';
import styles from '../table/table.module.css';

export interface RDT_TableBodyCellProps<TData extends RDT_RowData>
  extends TdHTMLAttributes<HTMLTableCellElement> {
  cell: RDT_Cell<TData>;
  row: RDT_Row<TData>;
  rowRef?: React.RefObject<HTMLTableRowElement | null>;
  staticColumnIndex?: number;
  staticRowIndex: number;
  table: RDT_TableInstance<TData>;
}

export const RDT_TableBodyCell = <TData extends RDT_RowData>({
  cell,
  row,
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
      enableColumnOrdering,
      tableCellProps,
    },
  } = table;
  const { creatingRow, draggingColumn, editingCell, editingRow } = getState();

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
      className={clsx(
        styles.tableBodyCell,
        isPinned && styles.tableBodyCellPinned,
        isPinned === 'left' && styles.tableBodyCellPinnedLeft,
        isPinned === 'right' && styles.tableBodyCellPinnedRight,
        showEditField && styles.tableBodyCellEditing,
        isDraggingColumn && styles.tableBodyCellDragging,
        isHoveredColumn && styles.tableBodyCellHovered,
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
      {showEditField ? (
        <RDT_EditCellTextField cell={cell} table={table} />
      ) : (
        <RDT_TableBodyCellValue
          cell={cell}
          rowRef={rowRef}
          staticColumnIndex={staticColumnIndex}
          staticRowIndex={staticRowIndex}
          table={table}
        />
      )}
    </td>
  );
};
