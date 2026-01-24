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
    options: { rowDragHandleProps },
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
    table.setDraggingRow(null);
    table.setHoveredRow(null);
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
