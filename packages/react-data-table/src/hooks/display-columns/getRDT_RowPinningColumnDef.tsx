import {
  type RDT_ColumnDef,
  type RDT_RowData,
  type RDT_StatefulTableOptions,
} from '../../types';
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils';

// TODO: Import actual component once built
// import { RDT_TableBodyRowPinButton } from '../../components/body/RDT_TableBodyRowPinButton';

export const getRDT_RowPinningColumnDef = <TData extends RDT_RowData>(
  tableOptions: RDT_StatefulTableOptions<TData>,
): RDT_ColumnDef<TData> => {
  const { icons, localization, rowPinningDisplayMode } = tableOptions;
  const PinIcon = icons.PushPinIcon;

  return {
    Cell: ({ row, table: _table }) => {
      // TODO: Replace with actual component once built
      // <RDT_TableBodyRowPinButton row={row} table={table} />
      const isPinned = row.getIsPinned();
      return (
        <button
          type="button"
          aria-label={isPinned ? localization.unpin : localization.pin}
          onClick={() => {
            row.pin(
              isPinned
                ? false
                : rowPinningDisplayMode?.includes('bottom')
                  ? 'bottom'
                  : 'top',
            );
          }}
          style={{
            cursor: 'pointer',
            padding: '4px',
            background: 'none',
            border: 'none',
            opacity: isPinned ? 1 : 0.5,
            transform: isPinned ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s, opacity 0.2s',
          }}
        >
          <PinIcon />
        </button>
      );
    },
    grow: false,
    ...defaultDisplayColumnProps({
      header: 'pin',
      id: 'rdt-row-pin',
      size: 60,
      tableOptions,
    }),
  };
};
