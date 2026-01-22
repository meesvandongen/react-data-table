import {
  type RDT_ColumnDef,
  type RDT_RowData,
  type RDT_StatefulTableOptions,
} from '../../types';
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils';

// TODO: Import actual component once built
// import { RDT_TableBodyRowGrabHandle } from '../../components/body/RDT_TableBodyRowGrabHandle';

export const getRDT_RowDragColumnDef = <TData extends RDT_RowData>(
  tableOptions: RDT_StatefulTableOptions<TData>,
): RDT_ColumnDef<TData> => {
  const { icons } = tableOptions;
  const DragIcon = icons.DragHandleIcon;

  return {
    Cell: ({ row: _row, rowRef: _rowRef, table: _table }) => {
      // TODO: Replace with actual component once built
      // <RDT_TableBodyRowGrabHandle row={row} rowRef={rowRef} table={table} />
      return (
        <button
          type="button"
          aria-label={tableOptions.localization.move}
          style={{
            cursor: 'grab',
            padding: '4px',
            background: 'none',
            border: 'none',
          }}
        >
          <DragIcon />
        </button>
      );
    },
    grow: false,
    ...defaultDisplayColumnProps({
      header: 'move',
      id: 'rdt-row-drag',
      size: 60,
      tableOptions,
    }),
  };
};
