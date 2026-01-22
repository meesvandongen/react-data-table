import {
  type RDT_ColumnDef,
  type RDT_RowData,
  type RDT_StatefulTableOptions,
} from '../../types';
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils';

export const getRDT_RowNumbersColumnDef = <TData extends RDT_RowData>(
  tableOptions: RDT_StatefulTableOptions<TData>,
): RDT_ColumnDef<TData> => {
  const { localization, rowNumberDisplayMode } = tableOptions;
  const {
    pagination: { pageIndex, pageSize },
  } = tableOptions.state;

  return {
    Cell: ({ row, staticRowIndex }) =>
      ((rowNumberDisplayMode === 'static'
        ? (staticRowIndex || 0) + (pageSize || 0) * (pageIndex || 0)
        : row.index) ?? 0) + 1,
    Header: () => localization.rowNumber,
    grow: false,
    ...defaultDisplayColumnProps({
      header: 'rowNumbers',
      id: 'rdt-row-numbers',
      size: 50,
      tableOptions,
    }),
  };
};
