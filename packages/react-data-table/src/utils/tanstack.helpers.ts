import { type ReactNode, type JSX } from 'react';
import {
  createRow as _createRow,
  flexRender as _flexRender,
  type Renderable,
} from '@tanstack/react-table';
import {
  type RDT_ColumnHelper,
  type RDT_DisplayColumnDef,
  type RDT_GroupColumnDef,
  type RDT_Row,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../types';
import { getAllLeafColumnDefs, getColumnId } from './column.utils';

export const flexRender = _flexRender as (
  Comp: Renderable<any>,
  props: any,
) => JSX.Element | ReactNode;

export function createRDTColumnHelper<
  TData extends RDT_RowData,
>(): RDT_ColumnHelper<TData> {
  return {
    accessor: (accessor, column) => {
      return typeof accessor === 'function'
        ? ({
            ...column,
            accessorFn: accessor,
          } as any)
        : {
            ...column,
            accessorKey: accessor,
          };
    },
    display: (column) => column as RDT_DisplayColumnDef<TData>,
    group: (column) => column as RDT_GroupColumnDef<TData>,
  };
}

export const createRow = <TData extends RDT_RowData>(
  table: RDT_TableInstance<TData>,
  originalRow?: TData,
  rowIndex = -1,
  depth = 0,
  subRows?: RDT_Row<TData>[],
  parentId?: string,
): RDT_Row<TData> =>
  _createRow(
    table as any,
    'rdt-row-create',
    originalRow ??
      Object.assign(
        {},
        ...getAllLeafColumnDefs(table.options.columns).map((col) => ({
          [getColumnId(col)]: '',
        })),
      ),
    rowIndex,
    depth,
    subRows as any,
    parentId,
  ) as RDT_Row<TData>;
