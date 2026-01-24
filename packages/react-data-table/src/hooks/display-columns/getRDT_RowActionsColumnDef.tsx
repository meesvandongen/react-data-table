import { RDT_ToggleRowActionMenuButton } from '../../components/buttons/RDT_ToggleRowActionMenuButton';
import {
  type RDT_ColumnDef,
  type RDT_RowData,
  type RDT_StatefulTableOptions,
} from '../../types';
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils';

export const getRDT_RowActionsColumnDef = <TData extends RDT_RowData>(
  tableOptions: RDT_StatefulTableOptions<TData>,
): RDT_ColumnDef<TData> => {
  return {
    Cell: ({ cell, row, staticRowIndex, table }) => (
      <RDT_ToggleRowActionMenuButton
        cell={cell}
        row={row}
        staticRowIndex={staticRowIndex}
        table={table}
      />
    ),
    ...defaultDisplayColumnProps({
      header: 'actions',
      id: 'rdt-row-actions',
      size: 70,
      tableOptions,
    }),
  };
};
