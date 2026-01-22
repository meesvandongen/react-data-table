import { useMemo } from 'react';
import {
  type RDT_Row,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../types';
import { getRDT_Rows } from '../utils/row.utils';

export const useRDT_Rows = <TData extends RDT_RowData>(
  table: RDT_TableInstance<TData>,
): RDT_Row<TData>[] => {
  const {
    getRowModel,
    getState,
    options: { data, enableGlobalFilterRankedResults, positionCreatingRow },
  } = table;
  const {
    creatingRow,
    expanded,
    globalFilter,
    pagination,
    rowPinning,
    sorting,
  } = getState();

  const rows = useMemo(
    () => getRDT_Rows(table),
    [
      creatingRow,
      data,
      enableGlobalFilterRankedResults,
      expanded,
      getRowModel().rows,
      globalFilter,
      pagination.pageIndex,
      pagination.pageSize,
      positionCreatingRow,
      rowPinning,
      sorting,
    ],
  );

  return rows;
};
