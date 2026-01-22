import {
  type RDT_RowData,
  type RDT_TableInstance,
  type RDT_TableOptions,
} from '../types';
import { useRDT_TableInstance } from './useRDT_TableInstance';
import { useRDT_TableOptions } from './useRDT_TableOptions';

/**
 * Main hook for creating a react-data-table instance.
 * This is the primary entry point for using the table.
 *
 * @param tableOptions - Configuration options for the table
 * @returns A table instance with all state and methods
 *
 * @example
 * ```tsx
 * const table = useDataTable({
 *   columns,
 *   data,
 *   enableRowSelection: true,
 * });
 *
 * return <DataTable table={table} />;
 * ```
 */
export const useDataTable = <TData extends RDT_RowData>(
  tableOptions: RDT_TableOptions<TData>,
): RDT_TableInstance<TData> =>
  useRDT_TableInstance(useRDT_TableOptions(tableOptions));
