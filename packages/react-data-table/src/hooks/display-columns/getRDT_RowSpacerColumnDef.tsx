import { RDT_DefaultDisplayColumn } from '../useRDT_TableOptions';
import {
  type RDT_ColumnDef,
  type RDT_RowData,
  type RDT_StatefulTableOptions,
} from '../../types';
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils';

const blankColProps = {
  children: null,
  style: {
    minWidth: 0,
    padding: 0,
    width: 0,
  } as React.CSSProperties,
};

export const getRDT_RowSpacerColumnDef = <TData extends RDT_RowData>(
  tableOptions: RDT_StatefulTableOptions<TData>,
): RDT_ColumnDef<TData> => {
  return {
    ...defaultDisplayColumnProps({
      id: 'rdt-row-spacer',
      size: 0,
      tableOptions,
    }),
    grow: true,
    ...RDT_DefaultDisplayColumn,
    tableCellProps: blankColProps,
    tableFooterCellProps: blankColProps,
    tableHeadCellProps: blankColProps,
  };
};
