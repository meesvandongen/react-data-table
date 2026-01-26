import {
  type ButtonHTMLAttributes,
  type DragEvent,
  type RefObject,
} from 'react';
import {
  type RDT_Column,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import { reorderColumn } from '../../utils/column.utils';
import { RDT_GrabHandleButton } from '../buttons/RDT_GrabHandleButton';

export interface RDT_TableHeadCellGrabHandleProps<TData extends RDT_RowData>
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  column: RDT_Column<TData>;
  table: RDT_TableInstance<TData>;
  tableHeadCellRef: RefObject<HTMLTableCellElement | null>;
}

export const RDT_TableHeadCellGrabHandle = <TData extends RDT_RowData>({
  column,
  table,
  tableHeadCellRef,
  ...rest
}: RDT_TableHeadCellGrabHandleProps<TData>) => {
  const {
    getState,
    options: { enableColumnOrdering },
    setColumnOrder,
    setColumnPinning,
    setHoveredColumn,
    setHoveredColumnDropPosition,
  } = table;
  const {
    columnOrder,
    draggingColumn,
    hoveredColumn,
    hoveredColumnDropPosition,
  } = getState();

  const handleDragStart = (event: DragEvent<HTMLButtonElement>) => {
    rest?.onDragStart?.(event);
    table.setDraggingColumn(column);
    try {
      event.dataTransfer.setDragImage(
        tableHeadCellRef.current as HTMLElement,
        0,
        0,
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleDragEnd = (event: DragEvent<HTMLButtonElement>) => {
    rest?.onDragEnd?.(event);
    if (hoveredColumn?.id === 'drop-zone') {
      column.toggleGrouping();
    } else if (
      enableColumnOrdering &&
      hoveredColumn &&
      hoveredColumn?.id !== draggingColumn?.id
    ) {
      const reorderedColumns = reorderColumn(
        column,
        hoveredColumn as RDT_Column<TData>,
        columnOrder,
        hoveredColumnDropPosition ?? undefined,
      );
      setColumnOrder(reorderedColumns);
      setColumnPinning(({ left = [], right = [] }) => ({
        left: reorderedColumns.filter((header) => left.includes(header)),
        right: reorderedColumns.filter((header) => right.includes(header)),
      }));
    }
    table.setDraggingColumn(null);
    setHoveredColumn(null);
    setHoveredColumnDropPosition(null);
  };

  return (
    <RDT_GrabHandleButton
      {...rest}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      table={table}
    />
  );
};
