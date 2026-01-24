import { type RefObject } from 'react';
import { RDT_TableBodyRowGrabHandle } from '../../components/body/RDT_TableBodyRowGrabHandle';
import {
  type RDT_ColumnDef,
  type RDT_RowData,
  type RDT_StatefulTableOptions,
} from '../../types';
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils';

export const getRDT_RowDragColumnDef = <TData extends RDT_RowData>(
  tableOptions: RDT_StatefulTableOptions<TData>,
): RDT_ColumnDef<TData> => {
  return {
    Cell: ({ row, rowRef, table }) => (
      <RDT_TableBodyRowGrabHandle
        row={row}
        rowRef={rowRef as RefObject<HTMLTableRowElement | null>}
        table={table}
      />
    ),
    grow: false,
    ...defaultDisplayColumnProps({
      header: 'move',
      id: 'rdt-row-drag',
      size: 60,
      tableOptions,
    }),
  };
};
