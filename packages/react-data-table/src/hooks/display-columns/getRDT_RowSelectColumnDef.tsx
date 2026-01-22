import {
  type RDT_ColumnDef,
  type RDT_RowData,
  type RDT_StatefulTableOptions,
} from '../../types';
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils';
import {
  getIsRowSelected,
  getRDT_RowSelectionHandler,
  getRDT_SelectAllHandler,
} from '../../utils/row.utils';

// TODO: Import actual component once built
// import { RDT_SelectCheckbox } from '../../components/inputs/RDT_SelectCheckbox';

export const getRDT_RowSelectColumnDef = <TData extends RDT_RowData>(
  tableOptions: RDT_StatefulTableOptions<TData>,
): RDT_ColumnDef<TData> => {
  const { enableMultiRowSelection, enableSelectAll, localization } =
    tableOptions;

  return {
    Cell: ({ row, staticRowIndex, table }) => {
      // TODO: Replace with actual component once built
      // <RDT_SelectCheckbox row={row} staticRowIndex={staticRowIndex} table={table} />
      const isChecked = getIsRowSelected({ row, table });
      const isIndeterminate = row.getIsSomeSelected();
      const canSelect = row.getCanSelect();

      return (
        <input
          type="checkbox"
          aria-label={localization.toggleSelectRow}
          checked={isChecked}
          disabled={!canSelect}
          ref={(el) => {
            if (el) el.indeterminate = isIndeterminate;
          }}
          onChange={(e) => {
            getRDT_RowSelectionHandler({ row, staticRowIndex, table })(e);
          }}
          style={{ cursor: canSelect ? 'pointer' : 'not-allowed' }}
        />
      );
    },
    Header:
      enableSelectAll && enableMultiRowSelection
        ? ({ table }) => {
            // TODO: Replace with actual component once built
            // <RDT_SelectCheckbox table={table} />
            const isAllSelected = table.getIsAllRowsSelected();
            const isSomeSelected = table.getIsSomeRowsSelected();

            return (
              <input
                type="checkbox"
                aria-label={localization.toggleSelectAll}
                checked={isAllSelected}
                ref={(el) => {
                  if (el) el.indeterminate = isSomeSelected && !isAllSelected;
                }}
                onChange={(e) => {
                  getRDT_SelectAllHandler({ table })(e);
                }}
                style={{ cursor: 'pointer' }}
              />
            );
          }
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
