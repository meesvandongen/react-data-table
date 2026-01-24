// Main exports
export { RDT_Default_Icons } from './icons';
export type { RDT_Icons } from './icons';

// Export all types
export type {
  DropdownOption,
  LiteralUnion,
  Prettify,
  RDT_AggregationFn,
  RDT_AggregationOption,
  RDT_Cell,
  RDT_Column,
  RDT_ColumnDef,
  RDT_ColumnFilterFnsState,
  RDT_ColumnFiltersState,
  RDT_ColumnHelper,
  RDT_ColumnOrderState,
  RDT_ColumnPinningState,
  RDT_ColumnSizingInfoState,
  RDT_ColumnSizingState,
  RDT_ColumnVirtualizer,
  RDT_DefinedColumnDef,
  RDT_DefinedTableOptions,
  RDT_DensityState,
  RDT_DisplayColumnDef,
  RDT_DisplayColumnIds,
  RDT_ExpandedState,
  RDT_FilterFn,
  RDT_FilterOption,
  RDT_GroupColumnDef,
  RDT_GroupingState,
  RDT_Header,
  RDT_HeaderGroup,
  RDT_InternalFilterOption,
  RDT_Localization,
  RDT_PaginationState,
  RDT_Row,
  RDT_RowActionMenuItem,
  RDT_RowData,
  RDT_RowModel,
  RDT_RowSelectionState,
  RDT_RowVirtualizer,
  RDT_SortingFn,
  RDT_SortingOption,
  RDT_SortingState,
  RDT_StatefulTableOptions,
  RDT_TableInstance,
  RDT_TableOptions,
  RDT_TableState,
  RDT_Updater,
  RDT_VirtualItem,
  RDT_VirtualizerOptions,
  RDT_VisibilityState,
  Xor,
} from './types';

// Import and re-export CSS
import './variables.css';

// Export filter/sort/aggregation functions
export { RDT_FilterFns } from './fns/filterFns';
export { RDT_SortingFns, rankGlobalFuzzy } from './fns/sortingFns';
export { RDT_AggregationFns } from './fns/aggregationFns';

// Export utility functions
export {
  // cell.utils
  cellKeyboardShortcuts,
  isCellEditable,
  openEditingCell,
  // column.utils
  getAllLeafColumnDefs,
  getColumnFilterInfo,
  getColumnId,
  getDefaultColumnFilterFn,
  prepareColumns,
  reorderColumn,
  useDropdownOptions,
  // displayColumn.utils
  defaultDisplayColumnProps,
  getDefaultColumnOrderIds,
  getLeadingDisplayColumnIds,
  getTrailingDisplayColumnIds,
  showRowActionsColumn,
  showRowDragColumn,
  showRowExpandColumn,
  showRowNumbersColumn,
  showRowPinningColumn,
  showRowSelectionColumn,
  showRowSpacerColumn,
  // row.utils
  getCanRankRows,
  getIsRankingRows,
  getIsRowSelected,
  getRDT_RowSelectionHandler,
  getRDT_Rows,
  getRDT_SelectAllHandler,
  // tanstack helpers
  createRDTColumnHelper,
  createRow,
  flexRender,
  // utils
  getValueAndLabel,
  parseFromValuesOrFunc,
} from './utils';

// Export hooks
export {
  useDataTable,
  useRDT_Effects,
  useRDT_TableInstance,
  useRDT_TableOptions,
  RDT_DefaultColumn,
  RDT_DefaultDisplayColumn,
} from './hooks';

// Export locales
export { RDT_Localization_EN } from './locales/en';

// Export components
export {
  DataTable,
  type DataTableProps,
  RDT_TablePaper,
  type RDT_TablePaperProps,
  RDT_TableContainer,
  type RDT_TableContainerProps,
  RDT_Table,
  type RDT_TableProps,
  RDT_TableLoadingOverlay,
  type RDT_TableLoadingOverlayProps,
  RDT_TableHead,
  type RDT_TableHeadProps,
  RDT_TableHeadRow,
  type RDT_TableHeadRowProps,
  RDT_TableHeadCell,
  type RDT_TableHeadCellProps,
  RDT_TableBody,
  Memo_RDT_TableBody,
  type RDT_TableBodyProps,
  RDT_TableBodyRow,
  Memo_RDT_TableBodyRow,
  type RDT_TableBodyRowProps,
  RDT_TableBodyCell,
  type RDT_TableBodyCellProps,
  RDT_TableFooter,
  type RDT_TableFooterProps,
  RDT_TableFooterRow,
  type RDT_TableFooterRowProps,
  RDT_TableFooterCell,
  type RDT_TableFooterCellProps,
} from './components';
