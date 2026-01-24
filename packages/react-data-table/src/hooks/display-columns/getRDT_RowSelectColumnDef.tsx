import { RDT_SelectCheckbox } from '../../components/inputs/RDT_SelectCheckbox';
import {
  type RDT_ColumnDef,
  type RDT_RowData,
  type RDT_StatefulTableOptions,
} from '../../types';
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils';

export const getRDT_RowSelectColumnDef = <TData extends RDT_RowData>(
  tableOptions: RDT_StatefulTableOptions<TData>,
): RDT_ColumnDef<TData> => {
  const { enableMultiRowSelection, enableSelectAll } = tableOptions;

  return {
    Cell: ({ row, staticRowIndex, table }) => (
      <RDT_SelectCheckbox
        row={row}
        staticRowIndex={staticRowIndex}
        table={table}
      />
    ),
    Header:
      enableSelectAll && enableMultiRowSelection
        ? ({ table }) => <RDT_SelectCheckbox table={table} />
        : undefined,
    grow: false,
    ...defaultDisplayColumnProps({
      header: 'select',
      id: 'rdt-row-select',
      size: enableSelectAll ? 60 : 70,
      tableOptions,
    }),
  };
};
