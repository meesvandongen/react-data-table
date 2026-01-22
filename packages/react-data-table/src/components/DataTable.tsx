import { useDataTable } from '../hooks/useDataTable';
import {
  type RDT_RowData,
  type RDT_TableInstance,
  type RDT_TableOptions,
  type Xor,
} from '../types';
import { RDT_TablePaper } from './table/RDT_TablePaper';

type TableInstanceProp<TData extends RDT_RowData> = {
  table: RDT_TableInstance<TData>;
};

export type DataTableProps<TData extends RDT_RowData> = Xor<
  TableInstanceProp<TData>,
  RDT_TableOptions<TData>
>;

const isTableInstanceProp = <TData extends RDT_RowData>(
  props: DataTableProps<TData>,
): props is TableInstanceProp<TData> =>
  (props as TableInstanceProp<TData>).table !== undefined;

export const DataTable = <TData extends RDT_RowData>(
  props: DataTableProps<TData>,
) => {
  let table: RDT_TableInstance<TData>;

  if (isTableInstanceProp(props)) {
    table = props.table;
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    table = useDataTable(props);
  }

  return <RDT_TablePaper table={table} />;
};
