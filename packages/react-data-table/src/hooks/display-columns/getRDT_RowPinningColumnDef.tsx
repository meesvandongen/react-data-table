import { RDT_TableBodyRowPinButton } from '../../components/body/RDT_TableBodyRowPinButton';
import {
  type RDT_ColumnDef,
  type RDT_RowData,
  type RDT_StatefulTableOptions,
} from '../../types';
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils';

export const getRDT_RowPinningColumnDef = <TData extends RDT_RowData>(
  tableOptions: RDT_StatefulTableOptions<TData>,
): RDT_ColumnDef<TData> => {
  return {
    Cell: ({ row, table }) => (
      <RDT_TableBodyRowPinButton row={row} table={table} />
    ),
    grow: false,
    ...defaultDisplayColumnProps({
      header: 'pin',
      id: 'rdt-row-pin',
      size: 60,
      tableOptions,
    }),
  };
};
