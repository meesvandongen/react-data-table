import {
  type ButtonHTMLAttributes,
  type DragEvent,
  type RefObject,
} from 'react';
import {
  type RDT_Row,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { RDT_GrabHandleButton } from '../buttons/RDT_GrabHandleButton';

export interface RDT_TableBodyRowGrabHandleProps<TData extends RDT_RowData>
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  row: RDT_Row<TData>;
  rowRef: RefObject<HTMLTableRowElement | null>;
  table: RDT_TableInstance<TData>;
}

export const RDT_TableBodyRowGrabHandle = <TData extends RDT_RowData>({
  row,
  rowRef,
  table,
  ...rest
}: RDT_TableBodyRowGrabHandleProps<TData>) => {
  const {
    getState,
    options: { onRowOrderChange, rowDragHandleProps },
  } = table;

  const buttonProps = {
    ...parseFromValuesOrFunc(rowDragHandleProps, { row, table }),
    ...rest,
  };

  const handleDragStart = (event: DragEvent<HTMLButtonElement>) => {
    buttonProps?.onDragStart?.(event);
    try {
      event.dataTransfer.setDragImage(rowRef.current as HTMLElement, 0, 0);
    } catch (e) {
      console.error(e);
    }
    table.setDraggingRow(row as any);
  };

  const handleDragEnd = (event: DragEvent<HTMLButtonElement>) => {
    buttonProps?.onDragEnd?.(event);

    const { draggingRow, hoveredRow, hoveredRowDropPosition } = getState();

    // Call onRowOrderChange if provided and we have valid drag targets
    if (
      onRowOrderChange &&
      draggingRow &&
      hoveredRow &&
      draggingRow.id !== hoveredRow.id
    ) {
      const draggedIndex = draggingRow.index;
      let targetIndex = (hoveredRow as RDT_Row<TData>).index;

      // Calculate the new index based on drop position
      if (hoveredRowDropPosition === 'after') {
        targetIndex += 1;
      }

      // Adjust if dragging from before the target
      if (draggedIndex < targetIndex) {
        targetIndex -= 1;
      }

      onRowOrderChange({
        draggedRow: draggingRow,
        newIndex: targetIndex,
        table,
        targetRow: hoveredRow as RDT_Row<TData>,
      });
    }

    table.setDraggingRow(null);
    table.setHoveredRow(null);
    table.setHoveredRowDropPosition(null);
  };

  return (
    <RDT_GrabHandleButton
      {...buttonProps}
      location="row"
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      table={table}
    />
  );
};
