import {
  type Dispatch,
  type HTMLAttributes,
  type MutableRefObject,
  type ReactNode,
  type RefObject,
  type SetStateAction,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from 'react';
import {
  type AccessorFn,
  type AggregationFn,
  type Cell,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnOrderState,
  type ColumnPinningState,
  type ColumnSizingInfoState,
  type ColumnSizingState,
  type DeepKeys,
  type DeepValue,
  type ExpandedState,
  type FilterFn,
  type GroupingState,
  type Header,
  type HeaderGroup,
  type OnChangeFn,
  type PaginationState,
  type Row,
  type RowSelectionState,
  type SortingFn,
  type SortingState,
  type Table,
  type TableOptions,
  type TableState,
  type Updater,
  type VisibilityState,
} from '@tanstack/react-table';
import {
  type VirtualItem,
  type Virtualizer,
  type VirtualizerOptions,
} from '@tanstack/react-virtual';
import type {
  ButtonProps,
  CheckboxProps,
  ComboBoxProps,
  DatePickerProps,
  DateValue,
  DialogProps,
  MenuProps,
  ProgressBarProps,
  SearchFieldProps,
  SelectProps,
  SliderProps,
  TextFieldProps,
  TooltipProps,
} from 'react-aria-components';

import { type RDT_AggregationFns } from './fns/aggregationFns';
import { type RDT_FilterFns } from './fns/filterFns';
import { type RDT_SortingFns } from './fns/sortingFns';
import { type RDT_Icons } from './icons';

export type { RDT_Icons };

// Utility types
export type LiteralUnion<T extends U, U = string> =
  | T
  | (U & Record<never, never>);

export type Prettify<T> = { [K in keyof T]: T[K] } & unknown;

export type Xor<A, B> =
  | Prettify<A & { [k in keyof B]?: never }>
  | Prettify<B & { [k in keyof A]?: never }>;

export type DropdownOption =
  | {
      label?: string;
      value: any;
    }
  | string;

// Basic types
export type RDT_DensityState = 'comfortable' | 'compact' | 'spacious';

export type RDT_ColumnFilterFnsState = Record<string, RDT_FilterOption>;

export type RDT_RowData = Record<string, any>;

// Re-exports from TanStack Table
export type RDT_ColumnFiltersState = ColumnFiltersState;
export type RDT_ColumnOrderState = ColumnOrderState;
export type RDT_ColumnPinningState = ColumnPinningState;
export type RDT_ColumnSizingInfoState = ColumnSizingInfoState;
export type RDT_ColumnSizingState = ColumnSizingState;
export type RDT_ExpandedState = ExpandedState;
export type RDT_GroupingState = GroupingState;
export type RDT_PaginationState = PaginationState;
export type RDT_RowSelectionState = RowSelectionState;
export type RDT_SortingState = SortingState;
export type RDT_Updater<T> = Updater<T>;
export type RDT_VirtualItem = VirtualItem;
export type RDT_VisibilityState = VisibilityState;

export type RDT_VirtualizerOptions<
  TScrollElement extends Element | Window = Element | Window,
  TItemElement extends Element = Element,
> = VirtualizerOptions<TScrollElement, TItemElement>;

export type RDT_ColumnVirtualizer<
  TScrollElement extends Element | Window = HTMLDivElement,
  TItemElement extends Element = HTMLTableCellElement,
> = Virtualizer<TScrollElement, TItemElement> & {
  virtualColumns: RDT_VirtualItem[];
  virtualPaddingLeft?: number;
  virtualPaddingRight?: number;
};

export type RDT_RowVirtualizer<
  TScrollElement extends Element | Window = HTMLDivElement,
  TItemElement extends Element = HTMLTableRowElement,
> = Virtualizer<TScrollElement, TItemElement> & {
  virtualRows: RDT_VirtualItem[];
};

export type RDT_ColumnHelper<TData extends RDT_RowData> = {
  accessor: <
    TAccessor extends AccessorFn<TData> | DeepKeys<TData>,
    TValue extends TAccessor extends AccessorFn<TData, infer TReturn>
      ? TReturn
      : TAccessor extends DeepKeys<TData>
        ? DeepValue<TData, TAccessor>
        : never,
  >(
    accessor: TAccessor,
    column: RDT_DisplayColumnDef<TData, TValue>,
  ) => RDT_ColumnDef<TData, TValue>;
  display: (column: RDT_DisplayColumnDef<TData>) => RDT_ColumnDef<TData>;
  group: (column: RDT_GroupColumnDef<TData>) => RDT_ColumnDef<TData>;
};

// Localization interface (unchanged from MRT)
export interface RDT_Localization {
  language: string;
  actions: string;
  and: string;
  cancel: string;
  cellActions: string;
  changeFilterMode: string;
  changeSearchMode: string;
  clearFilter: string;
  clearSearch: string;
  clearSelection: string;
  clearSort: string;
  clickToCopy: string;
  close: string;
  collapse: string;
  collapseAll: string;
  columnActions: string;
  columns: string;
  copiedToClipboard: string;
  copy: string;
  create: string;
  dropToGroupBy: string;
  edit: string;
  expand: string;
  expandAll: string;
  filterArrIncludes: string;
  filterArrIncludesAll: string;
  filterArrIncludesSome: string;
  filterBetween: string;
  filterBetweenInclusive: string;
  filterByColumn: string;
  filterContains: string;
  filterEmpty: string;
  filterEndsWith: string;
  filterEquals: string;
  filterEqualsString: string;
  filterFuzzy: string;
  filterGreaterThan: string;
  filterGreaterThanOrEqualTo: string;
  filterIncludesString: string;
  filterIncludesStringSensitive: string;
  filteringByColumn: string;
  filterInNumberRange: string;
  filterLessThan: string;
  filterLessThanOrEqualTo: string;
  filterMode: string;
  filterNotEmpty: string;
  filterNotEquals: string;
  filterStartsWith: string;
  filterWeakEquals: string;
  goToFirstPage: string;
  goToLastPage: string;
  goToNextPage: string;
  goToPreviousPage: string;
  grab: string;
  groupByColumn: string;
  groupedBy: string;
  hideAll: string;
  hideColumn: string;
  max: string;
  min: string;
  move: string;
  noRecordsToDisplay: string;
  noResultsFound: string;
  of: string;
  or: string;
  pin: string;
  pinToLeft: string;
  pinToRight: string;
  resetColumnSize: string;
  resetOrder: string;
  rowActions: string;
  rowNumber: string;
  rowNumbers: string;
  rowsPerPage: string;
  save: string;
  search: string;
  select: string;
  selectedCountOfRowCountRowsSelected: string;
  showAll: string;
  showAllColumns: string;
  showHideColumns: string;
  showHideFilters: string;
  showHideSearch: string;
  sortByColumnAsc: string;
  sortByColumnDesc: string;
  sortedByColumnAsc: string;
  sortedByColumnDesc: string;
  thenBy: string;
  toggleDensity: string;
  toggleFullScreen: string;
  toggleSelectAll: string;
  toggleSelectRow: string;
  toggleVisibility: string;
  ungroupByColumn: string;
  unpin: string;
  unpinAll: string;
}

export interface RDT_RowModel<TData extends RDT_RowData> {
  flatRows: RDT_Row<TData>[];
  rows: RDT_Row<TData>[];
  rowsById: { [key: string]: RDT_Row<TData> };
}

export type RDT_TableInstance<TData extends RDT_RowData> = Omit<
  Table<TData>,
  | 'getAllColumns'
  | 'getAllFlatColumns'
  | 'getAllLeafColumns'
  | 'getBottomRows'
  | 'getCenterLeafColumns'
  | 'getCenterRows'
  | 'getColumn'
  | 'getExpandedRowModel'
  | 'getFlatHeaders'
  | 'getFooterGroups'
  | 'getHeaderGroups'
  | 'getLeafHeaders'
  | 'getLeftLeafColumns'
  | 'getPaginationRowModel'
  | 'getPreFilteredRowModel'
  | 'getPrePaginationRowModel'
  | 'getRightLeafColumns'
  | 'getRowModel'
  | 'getSelectedRowModel'
  | 'getState'
  | 'getTopRows'
  | 'options'
> & {
  getAllColumns: () => RDT_Column<TData>[];
  getAllFlatColumns: () => RDT_Column<TData>[];
  getAllLeafColumns: () => RDT_Column<TData>[];
  getBottomRows: () => RDT_Row<TData>[];
  getCenterLeafColumns: () => RDT_Column<TData>[];
  getCenterRows: () => RDT_Row<TData>[];
  getColumn: (columnId: string) => RDT_Column<TData>;
  getExpandedRowModel: () => RDT_RowModel<TData>;
  getFlatHeaders: () => RDT_Header<TData>[];
  getFooterGroups: () => RDT_HeaderGroup<TData>[];
  getHeaderGroups: () => RDT_HeaderGroup<TData>[];
  getLeafHeaders: () => RDT_Header<TData>[];
  getLeftLeafColumns: () => RDT_Column<TData>[];
  getPaginationRowModel: () => RDT_RowModel<TData>;
  getPreFilteredRowModel: () => RDT_RowModel<TData>;
  getPrePaginationRowModel: () => RDT_RowModel<TData>;
  getRightLeafColumns: () => RDT_Column<TData>[];
  getRowModel: () => RDT_RowModel<TData>;
  getSelectedRowModel: () => RDT_RowModel<TData>;
  getState: () => RDT_TableState<TData>;
  getTopRows: () => RDT_Row<TData>[];
  options: RDT_StatefulTableOptions<TData>;
  refs: {
    actionCellRef: RefObject<HTMLTableCellElement | null>;
    bottomToolbarRef: RefObject<HTMLDivElement | null>;
    editInputRefs: RefObject<Record<string, HTMLInputElement> | null>;
    filterInputRefs: RefObject<Record<string, HTMLInputElement> | null>;
    lastSelectedRowId: MutableRefObject<null | string>;
    searchInputRef: RefObject<HTMLInputElement | null>;
    tableContainerRef: RefObject<HTMLDivElement | null>;
    tableFooterRef: RefObject<HTMLTableSectionElement | null>;
    tableHeadCellRefs: RefObject<Record<string, HTMLTableCellElement> | null>;
    tableHeadRef: RefObject<HTMLTableSectionElement | null>;
    tablePaperRef: RefObject<HTMLDivElement | null>;
    topToolbarRef: RefObject<HTMLDivElement | null>;
  };
  setActionCell: Dispatch<SetStateAction<RDT_Cell<TData> | null>>;
  setColumnFilterFns: Dispatch<SetStateAction<RDT_ColumnFilterFnsState>>;
  setCreatingRow: Dispatch<SetStateAction<RDT_Row<TData> | null | true>>;
  setDensity: Dispatch<SetStateAction<RDT_DensityState>>;
  setDraggingColumn: Dispatch<SetStateAction<RDT_Column<TData> | null>>;
  setDraggingRow: Dispatch<SetStateAction<RDT_Row<TData> | null>>;
  setEditingCell: Dispatch<SetStateAction<RDT_Cell<TData> | null>>;
  setEditingRow: Dispatch<SetStateAction<RDT_Row<TData> | null>>;
  setGlobalFilterFn: Dispatch<SetStateAction<RDT_FilterOption>>;
  setHoveredColumn: Dispatch<SetStateAction<Partial<RDT_Column<TData>> | null>>;
  setHoveredRow: Dispatch<SetStateAction<Partial<RDT_Row<TData>> | null>>;
  setIsFullScreen: Dispatch<SetStateAction<boolean>>;
  setShowAlertBanner: Dispatch<SetStateAction<boolean>>;
  setShowColumnFilters: Dispatch<SetStateAction<boolean>>;
  setShowGlobalFilter: Dispatch<SetStateAction<boolean>>;
  setShowToolbarDropZone: Dispatch<SetStateAction<boolean>>;
};

export type RDT_DefinedTableOptions<TData extends RDT_RowData> = Omit<
  RDT_TableOptions<TData>,
  'icons' | 'localization'
> & {
  icons: RDT_Icons;
  localization: RDT_Localization;
};

export type RDT_StatefulTableOptions<TData extends RDT_RowData> =
  RDT_DefinedTableOptions<TData> & {
    state: Pick<
      RDT_TableState<TData>,
      | 'columnFilterFns'
      | 'columnOrder'
      | 'columnSizingInfo'
      | 'creatingRow'
      | 'density'
      | 'draggingColumn'
      | 'draggingRow'
      | 'editingCell'
      | 'editingRow'
      | 'globalFilterFn'
      | 'grouping'
      | 'hoveredColumn'
      | 'hoveredRow'
      | 'isFullScreen'
      | 'pagination'
      | 'showAlertBanner'
      | 'showColumnFilters'
      | 'showGlobalFilter'
      | 'showToolbarDropZone'
    >;
  };

export interface RDT_TableState<TData extends RDT_RowData> extends TableState {
  actionCell?: RDT_Cell<TData> | null;
  columnFilterFns: RDT_ColumnFilterFnsState;
  creatingRow: RDT_Row<TData> | null;
  density: RDT_DensityState;
  draggingColumn: RDT_Column<TData> | null;
  draggingRow: RDT_Row<TData> | null;
  editingCell: RDT_Cell<TData> | null;
  editingRow: RDT_Row<TData> | null;
  globalFilterFn: RDT_FilterOption;
  hoveredColumn: Partial<RDT_Column<TData>> | null;
  hoveredRow: Partial<RDT_Row<TData>> | null;
  isFullScreen: boolean;
  isLoading: boolean;
  isSaving: boolean;
  showAlertBanner: boolean;
  showColumnFilters: boolean;
  showGlobalFilter: boolean;
  showLoadingOverlay: boolean;
  showProgressBars: boolean;
  showSkeletons: boolean;
  showToolbarDropZone: boolean;
}

export type RDT_DisplayColumnIds =
  | 'rdt-row-actions'
  | 'rdt-row-drag'
  | 'rdt-row-expand'
  | 'rdt-row-numbers'
  | 'rdt-row-pin'
  | 'rdt-row-select'
  | 'rdt-row-spacer';

export type RDT_FilterOption = LiteralUnion<
  string & keyof typeof RDT_FilterFns
>;

export type RDT_FilterFn<TData extends RDT_RowData> =
  | FilterFn<TData>
  | RDT_FilterOption;

export type RDT_SortingOption = LiteralUnion<
  string & keyof typeof RDT_SortingFns
>;

export type RDT_SortingFn<TData extends RDT_RowData> =
  | RDT_SortingOption
  | SortingFn<TData>;

export type RDT_AggregationOption = string & keyof typeof RDT_AggregationFns;

export type RDT_AggregationFn<TData extends RDT_RowData> =
  | AggregationFn<TData>
  | RDT_AggregationOption;

export type RDT_InternalFilterOption = {
  divider: boolean;
  label: string;
  option: string;
  symbol: string;
};

// Column Definition Types
export interface RDT_ColumnDef<TData extends RDT_RowData, TValue = unknown>
  extends Omit<
    ColumnDef<TData, TValue>,
    | 'accessorKey'
    | 'aggregatedCell'
    | 'aggregationFn'
    | 'cell'
    | 'columns'
    | 'filterFn'
    | 'footer'
    | 'header'
    | 'id'
    | 'sortingFn'
  > {
  accessorFn?: (originalRow: TData) => TValue;
  accessorKey?: DeepKeys<TData> | (string & {});
  AggregatedCell?: (props: {
    cell: RDT_Cell<TData, TValue>;
    column: RDT_Column<TData, TValue>;
    row: RDT_Row<TData>;
    table: RDT_TableInstance<TData>;
    staticColumnIndex?: number;
    staticRowIndex?: number;
  }) => ReactNode;
  aggregationFn?: Array<RDT_AggregationFn<TData>> | RDT_AggregationFn<TData>;
  Cell?: (props: {
    cell: RDT_Cell<TData, TValue>;
    column: RDT_Column<TData, TValue>;
    renderedCellValue: ReactNode;
    row: RDT_Row<TData>;
    rowRef?: RefObject<HTMLTableRowElement | null>;
    staticColumnIndex?: number;
    staticRowIndex?: number;
    table: RDT_TableInstance<TData>;
  }) => ReactNode;
  columnDefType?: 'data' | 'display' | 'group';
  columnFilterModeOptions?: Array<
    LiteralUnion<string & RDT_FilterOption>
  > | null;
  columns?: RDT_ColumnDef<TData, TValue>[];
  Edit?: (props: {
    cell: RDT_Cell<TData, TValue>;
    column: RDT_Column<TData, TValue>;
    row: RDT_Row<TData>;
    table: RDT_TableInstance<TData>;
  }) => ReactNode;
  editSelectOptions?:
    | ((props: {
        cell: RDT_Cell<TData, TValue>;
        column: RDT_Column<TData>;
        row: RDT_Row<TData>;
        table: RDT_TableInstance<TData>;
      }) => DropdownOption[])
    | DropdownOption[];
  editVariant?: 'select' | 'text';
  enableClickToCopy?:
    | 'context-menu'
    | ((cell: RDT_Cell<TData>) => 'context-menu' | boolean)
    | boolean;
  enableColumnActions?: boolean;
  enableColumnDragging?: boolean;
  enableColumnFilterModes?: boolean;
  enableColumnOrdering?: boolean;
  enableEditing?: ((row: RDT_Row<TData>) => boolean) | boolean;
  enableFilterMatchHighlighting?: boolean;
  Filter?: (props: {
    column: RDT_Column<TData, TValue>;
    header: RDT_Header<TData>;
    rangeFilterIndex?: number;
    table: RDT_TableInstance<TData>;
  }) => ReactNode;
  filterFn?: RDT_FilterFn<TData>;
  filterSelectOptions?: DropdownOption[];
  filterVariant?:
    | 'autocomplete'
    | 'checkbox'
    | 'date'
    | 'date-range'
    | 'datetime'
    | 'datetime-range'
    | 'multi-select'
    | 'range'
    | 'range-slider'
    | 'select'
    | 'text'
    | 'time'
    | 'time-range';
  footer?: string;
  Footer?:
    | ((props: {
        column: RDT_Column<TData, TValue>;
        footer: RDT_Header<TData>;
        table: RDT_TableInstance<TData>;
      }) => ReactNode)
    | ReactNode;
  GroupedCell?: (props: {
    cell: RDT_Cell<TData, TValue>;
    column: RDT_Column<TData, TValue>;
    row: RDT_Row<TData>;
    table: RDT_TableInstance<TData>;
    staticColumnIndex?: number;
    staticRowIndex?: number;
  }) => ReactNode;
  grow?: boolean | number;
  header: string;
  Header?:
    | ((props: {
        column: RDT_Column<TData, TValue>;
        header: RDT_Header<TData>;
        table: RDT_TableInstance<TData>;
      }) => ReactNode)
    | ReactNode;
  id?: LiteralUnion<string & keyof TData>;

  // React Aria Component Props (replacing mui*Props)
  columnActionsButtonProps?:
    | ((props: {
        column: RDT_Column<TData>;
        table: RDT_TableInstance<TData>;
      }) => ButtonProps)
    | ButtonProps;
  columnDragHandleProps?:
    | ((props: {
        column: RDT_Column<TData>;
        table: RDT_TableInstance<TData>;
      }) => ButtonProps)
    | ButtonProps;
  copyButtonProps?:
    | ((props: {
        cell: RDT_Cell<TData, TValue>;
        column: RDT_Column<TData>;
        row: RDT_Row<TData>;
        table: RDT_TableInstance<TData>;
      }) => ButtonProps)
    | ButtonProps;
  editTextFieldProps?:
    | ((props: {
        cell: RDT_Cell<TData, TValue>;
        column: RDT_Column<TData>;
        row: RDT_Row<TData>;
        table: RDT_TableInstance<TData>;
      }) => TextFieldProps)
    | TextFieldProps;
  filterComboBoxProps?:
    | ((props: {
        column: RDT_Column<TData>;
        table: RDT_TableInstance<TData>;
      }) => ComboBoxProps<object>)
    | ComboBoxProps<object>;
  filterCheckboxProps?:
    | ((props: {
        column: RDT_Column<TData>;
        table: RDT_TableInstance<TData>;
      }) => CheckboxProps)
    | CheckboxProps;
  filterDatePickerProps?:
    | ((props: {
        column: RDT_Column<TData>;
        rangeFilterIndex?: number;
        table: RDT_TableInstance<TData>;
      }) => DatePickerProps<DateValue>)
    | DatePickerProps<DateValue>;
  filterSliderProps?:
    | ((props: {
        column: RDT_Column<TData>;
        table: RDT_TableInstance<TData>;
      }) => SliderProps)
    | SliderProps;
  filterTextFieldProps?:
    | ((props: {
        column: RDT_Column<TData>;
        rangeFilterIndex?: number;
        table: RDT_TableInstance<TData>;
      }) => TextFieldProps)
    | TextFieldProps;

  // Native HTML props for table cells
  tableCellProps?:
    | ((props: {
        cell: RDT_Cell<TData, TValue>;
        column: RDT_Column<TData>;
        row: RDT_Row<TData>;
        table: RDT_TableInstance<TData>;
      }) => TdHTMLAttributes<HTMLTableCellElement>)
    | TdHTMLAttributes<HTMLTableCellElement>;
  tableFooterCellProps?:
    | ((props: {
        column: RDT_Column<TData>;
        table: RDT_TableInstance<TData>;
      }) => TdHTMLAttributes<HTMLTableCellElement>)
    | TdHTMLAttributes<HTMLTableCellElement>;
  tableHeadCellProps?:
    | ((props: {
        column: RDT_Column<TData>;
        table: RDT_TableInstance<TData>;
      }) => ThHTMLAttributes<HTMLTableCellElement>)
    | ThHTMLAttributes<HTMLTableCellElement>;

  PlaceholderCell?: (props: {
    cell: RDT_Cell<TData, TValue>;
    column: RDT_Column<TData, TValue>;
    row: RDT_Row<TData>;
    table: RDT_TableInstance<TData>;
  }) => ReactNode;
  renderCellActionMenuItems?: (props: {
    cell: RDT_Cell<TData>;
    closeMenu: () => void;
    column: RDT_Column<TData>;
    internalMenuItems: ReactNode[];
    row: RDT_Row<TData>;
    staticColumnIndex?: number;
    staticRowIndex?: number;
    table: RDT_TableInstance<TData>;
  }) => ReactNode[];
  renderColumnActionsMenuItems?: (props: {
    closeMenu: () => void;
    column: RDT_Column<TData>;
    internalColumnMenuItems: ReactNode[];
    table: RDT_TableInstance<TData>;
  }) => ReactNode[];
  renderColumnFilterModeMenuItems?: (props: {
    column: RDT_Column<TData>;
    internalFilterOptions: RDT_InternalFilterOption[];
    onSelectFilterMode: (filterMode: RDT_FilterOption) => void;
    table: RDT_TableInstance<TData>;
  }) => ReactNode[];
  sortingFn?: RDT_SortingFn<TData>;
  visibleInShowHideMenu?: boolean;
}

export type RDT_DisplayColumnDef<
  TData extends RDT_RowData,
  TValue = unknown,
> = Omit<RDT_ColumnDef<TData, TValue>, 'accessorFn' | 'accessorKey'>;

export type RDT_GroupColumnDef<TData extends RDT_RowData> =
  RDT_DisplayColumnDef<TData, any> & {
    columns: RDT_ColumnDef<TData>[];
  };

export type RDT_DefinedColumnDef<
  TData extends RDT_RowData,
  TValue = unknown,
> = Omit<RDT_ColumnDef<TData, TValue>, 'defaultDisplayColumn' | 'id'> & {
  _filterFn: RDT_FilterOption;
  defaultDisplayColumn: Partial<RDT_ColumnDef<TData, TValue>>;
  id: string;
};

export type RDT_Column<TData extends RDT_RowData, TValue = unknown> = Omit<
  Column<TData, TValue>,
  'columnDef' | 'columns' | 'filterFn' | 'footer' | 'header'
> & {
  columnDef: RDT_DefinedColumnDef<TData, TValue>;
  columns?: RDT_Column<TData, TValue>[];
  filterFn?: RDT_FilterFn<TData>;
  footer: string;
  header: string;
};

export type RDT_Header<TData extends RDT_RowData> = Omit<
  Header<TData, unknown>,
  'column'
> & {
  column: RDT_Column<TData>;
};

export type RDT_HeaderGroup<TData extends RDT_RowData> = Omit<
  HeaderGroup<TData>,
  'headers'
> & {
  headers: RDT_Header<TData>[];
};

export type RDT_Row<TData extends RDT_RowData> = Omit<
  Row<TData>,
  | '_valuesCache'
  | 'getAllCells'
  | 'getParentRow'
  | 'getParentRows'
  | 'getRow'
  | 'getVisibleCells'
  | 'subRows'
> & {
  _valuesCache: Record<LiteralUnion<string & DeepKeys<TData>>, any>;
  getAllCells: () => RDT_Cell<TData>[];
  getParentRow: () => RDT_Row<TData> | null;
  getParentRows: () => RDT_Row<TData>[];
  getRow: () => RDT_Row<TData>;
  getVisibleCells: () => RDT_Cell<TData>[];
  subRows?: RDT_Row<TData>[];
};

export type RDT_Cell<TData extends RDT_RowData, TValue = unknown> = Omit<
  Cell<TData, TValue>,
  'column' | 'row'
> & {
  column: RDT_Column<TData, TValue>;
  row: RDT_Row<TData>;
};

/**
 * Main table options interface
 * This is a simplified initial version - will be expanded as components are built
 */
export interface RDT_TableOptions<TData extends RDT_RowData>
  extends Omit<
    Partial<TableOptions<TData>>,
    | 'columns'
    | 'data'
    | 'defaultColumn'
    | 'enableRowSelection'
    | 'expandRowsFn'
    | 'getRowId'
    | 'globalFilterFn'
    | 'initialState'
    | 'onStateChange'
    | 'state'
  > {
  // Required props
  columns: RDT_ColumnDef<TData, any>[];
  data: TData[];

  // Optional configuration
  defaultColumn?: Partial<RDT_ColumnDef<TData>>;
  defaultDisplayColumn?: Partial<RDT_DisplayColumnDef<TData>>;
  displayColumnDefOptions?: Partial<{
    [key in RDT_DisplayColumnIds]: Partial<RDT_DisplayColumnDef<TData>>;
  }>;

  // Display modes
  columnFilterDisplayMode?: 'custom' | 'popover' | 'subheader';
  createDisplayMode?: 'custom' | 'modal' | 'row';
  editDisplayMode?: 'cell' | 'custom' | 'modal' | 'row' | 'table';
  layoutMode?: 'grid' | 'grid-no-grow' | 'semantic';
  paginationDisplayMode?: 'custom' | 'default' | 'pages';
  rowNumberDisplayMode?: 'original' | 'static';
  rowPinningDisplayMode?:
    | 'bottom'
    | 'select-bottom'
    | 'select-sticky'
    | 'select-top'
    | 'sticky'
    | 'top'
    | 'top-and-bottom';

  // Feature enables
  enableBatchRowSelection?: boolean;
  enableBottomToolbar?: boolean;
  enableCellActions?: ((cell: RDT_Cell<TData>) => boolean) | boolean;
  enableClickToCopy?:
    | 'context-menu'
    | ((cell: RDT_Cell<TData>) => 'context-menu' | boolean)
    | boolean;
  enableColumnActions?: boolean;
  enableColumnDragging?: boolean;
  enableColumnFilterModes?: boolean;
  enableColumnOrdering?: boolean;
  enableColumnVirtualization?: boolean;
  enableDensityToggle?: boolean;
  enableEditing?: ((row: RDT_Row<TData>) => boolean) | boolean;
  enableExpandAll?: boolean;
  enableFacetedValues?: boolean;
  enableFilterMatchHighlighting?: boolean;
  enableFullScreenToggle?: boolean;
  enableGlobalFilterModes?: boolean;
  enableGlobalFilterRankedResults?: boolean;
  enableKeyboardShortcuts?: boolean;
  enablePagination?: boolean;
  enableRowActions?: boolean;
  enableRowDragging?: boolean;
  enableRowNumbers?: boolean;
  enableRowOrdering?: boolean;
  enableRowSelection?: ((row: RDT_Row<TData>) => boolean) | boolean;
  enableRowVirtualization?: boolean;
  enableSelectAll?: boolean;
  enableStickyFooter?: boolean;
  enableStickyHeader?: boolean;
  enableTableFooter?: boolean;
  enableTableHead?: boolean;
  enableToolbarInternalActions?: boolean;
  enableTopToolbar?: boolean;

  // Functions
  expandRowsFn?: (dataRow: TData) => TData[];
  getRowId?: (
    originalRow: TData,
    index: number,
    parentRow: RDT_Row<TData>,
  ) => string;
  globalFilterFn?: RDT_FilterOption;

  // Customization
  columnFilterModeOptions?: Array<
    LiteralUnion<string & RDT_FilterOption>
  > | null;
  globalFilterModeOptions?: RDT_FilterOption[] | null;
  icons?: Partial<RDT_Icons>;
  id?: string;
  localization?: Partial<RDT_Localization>;
  memoMode?: 'cells' | 'rows' | 'table-body';

  // Position options
  positionActionsColumn?: 'first' | 'last';
  positionCreatingRow?: 'bottom' | 'top' | number;
  positionExpandColumn?: 'first' | 'last';
  positionGlobalFilter?: 'left' | 'none' | 'right';
  positionPagination?: 'both' | 'bottom' | 'none' | 'top';
  positionToolbarAlertBanner?: 'bottom' | 'head-overlay' | 'none' | 'top';
  positionToolbarDropZone?: 'both' | 'bottom' | 'none' | 'top';

  selectAllMode?: 'all' | 'page';

  // State management
  initialState?: Partial<RDT_TableState<TData>>;
  state?: Partial<RDT_TableState<TData>>;

  // Virtualizer refs and options
  columnVirtualizerInstanceRef?: RefObject<RDT_ColumnVirtualizer | null>;
  columnVirtualizerOptions?:
    | ((props: {
        table: RDT_TableInstance<TData>;
      }) => Partial<VirtualizerOptions<HTMLDivElement, HTMLTableCellElement>>)
    | Partial<VirtualizerOptions<HTMLDivElement, HTMLTableCellElement>>;
  rowVirtualizerInstanceRef?: RefObject<RDT_RowVirtualizer | null>;
  rowVirtualizerOptions?:
    | ((props: {
        table: RDT_TableInstance<TData>;
      }) => Partial<VirtualizerOptions<HTMLDivElement, HTMLTableRowElement>>)
    | Partial<VirtualizerOptions<HTMLDivElement, HTMLTableRowElement>>;

  // Callbacks (will expand as we build features)
  onActionCellChange?: OnChangeFn<RDT_Cell<TData> | null>;
  onColumnFilterFnsChange?: OnChangeFn<{ [key: string]: RDT_FilterOption }>;
  onCreatingRowCancel?: (props: {
    row: RDT_Row<TData>;
    table: RDT_TableInstance<TData>;
  }) => void;
  onCreatingRowChange?: OnChangeFn<RDT_Row<TData> | null>;
  onCreatingRowSave?: (props: {
    exitCreatingMode: () => void;
    row: RDT_Row<TData>;
    table: RDT_TableInstance<TData>;
    values: Record<LiteralUnion<string & DeepKeys<TData>>, any>;
  }) => Promise<void> | void;
  onDensityChange?: OnChangeFn<RDT_DensityState>;
  onDraggingColumnChange?: OnChangeFn<RDT_Column<TData> | null>;
  onDraggingRowChange?: OnChangeFn<RDT_Row<TData> | null>;
  onEditingCellChange?: OnChangeFn<RDT_Cell<TData> | null>;
  onEditingRowCancel?: (props: {
    row: RDT_Row<TData>;
    table: RDT_TableInstance<TData>;
  }) => void;
  onEditingRowChange?: OnChangeFn<RDT_Row<TData> | null>;
  onEditingRowSave?: (props: {
    exitEditingMode: () => void;
    row: RDT_Row<TData>;
    table: RDT_TableInstance<TData>;
    values: Record<LiteralUnion<string & DeepKeys<TData>>, any>;
  }) => Promise<void> | void;
  onGlobalFilterFnChange?: OnChangeFn<RDT_FilterOption>;
  onHoveredColumnChange?: OnChangeFn<Partial<RDT_Column<TData>> | null>;
  onHoveredRowChange?: OnChangeFn<Partial<RDT_Row<TData>> | null>;
  onIsFullScreenChange?: OnChangeFn<boolean>;
  onShowAlertBannerChange?: OnChangeFn<boolean>;
  onShowColumnFiltersChange?: OnChangeFn<boolean>;
  onShowGlobalFilterChange?: OnChangeFn<boolean>;
  onShowToolbarDropZoneChange?: OnChangeFn<boolean>;

  // Render props (will expand as we build components)
  renderBottomToolbar?:
    | ((props: { table: RDT_TableInstance<TData> }) => ReactNode)
    | ReactNode;
  renderBottomToolbarCustomActions?: (props: {
    table: RDT_TableInstance<TData>;
  }) => ReactNode;
  renderCaption?:
    | ((props: { table: RDT_TableInstance<TData> }) => ReactNode)
    | ReactNode;
  renderDetailPanel?: (props: {
    row: RDT_Row<TData>;
    table: RDT_TableInstance<TData>;
  }) => ReactNode;
  renderEmptyRowsFallback?: (props: {
    table: RDT_TableInstance<TData>;
  }) => ReactNode;
  renderRowActions?: (props: {
    cell: RDT_Cell<TData>;
    row: RDT_Row<TData>;
    staticRowIndex?: number;
    table: RDT_TableInstance<TData>;
  }) => ReactNode;
  renderTopToolbar?:
    | ((props: { table: RDT_TableInstance<TData> }) => ReactNode)
    | ReactNode;
  renderTopToolbarCustomActions?: (props: {
    table: RDT_TableInstance<TData>;
  }) => ReactNode;
  renderToolbarAlertBannerContent?: (props: {
    groupedAlert: ReactNode | null;
    selectedAlert: ReactNode | null;
    table: RDT_TableInstance<TData>;
  }) => ReactNode;
  renderToolbarInternalActions?: (props: {
    table: RDT_TableInstance<TData>;
  }) => ReactNode;
  renderGlobalFilterModeMenuItems?: (props: {
    internalFilterOptions: RDT_InternalFilterOption[];
    onSelectFilterMode: (filterMode: RDT_FilterOption) => void;
    table: RDT_TableInstance<TData>;
  }) => ReactNode[];
  renderColumnActionsMenuItems?: (props: {
    closeMenu: () => void;
    column: RDT_Column<TData>;
    internalColumnMenuItems: ReactNode[];
    table: RDT_TableInstance<TData>;
  }) => ReactNode[];
  renderColumnFilterModeMenuItems?: (props: {
    column: RDT_Column<TData>;
    internalFilterOptions: RDT_InternalFilterOption[];
    onSelectFilterMode: (filterMode: RDT_FilterOption) => void;
    table: RDT_TableInstance<TData>;
  }) => ReactNode[];
  renderCellActionMenuItems?: (props: {
    cell: RDT_Cell<TData>;
    closeMenu: () => void;
    column: RDT_Column<TData>;
    internalMenuItems: ReactNode[];
    row: RDT_Row<TData>;
    staticColumnIndex?: number;
    staticRowIndex?: number;
    table: RDT_TableInstance<TData>;
  }) => ReactNode[];
  renderRowActionMenuItems?: (props: {
    closeMenu: () => void;
    row: RDT_Row<TData>;
    staticRowIndex?: number;
    table: RDT_TableInstance<TData>;
  }) => ReactNode[];
  renderCreateRowModalContent?: (props: {
    internalEditComponents: ReactNode[];
    row: RDT_Row<TData>;
    table: RDT_TableInstance<TData>;
  }) => ReactNode;
  renderEditRowModalContent?: (props: {
    internalEditComponents: ReactNode[];
    row: RDT_Row<TData>;
    table: RDT_TableInstance<TData>;
  }) => ReactNode;

  // Component props - Native HTML elements (with ref support)
  tablePaperProps?:
    | ((props: {
        table: RDT_TableInstance<TData>;
      }) => HTMLAttributes<HTMLDivElement> & {
        ref?: React.Ref<HTMLDivElement>;
      })
    | (HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> });
  tableContainerProps?:
    | ((props: {
        table: RDT_TableInstance<TData>;
      }) => HTMLAttributes<HTMLDivElement> & {
        ref?: React.Ref<HTMLDivElement>;
      })
    | (HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> });
  loadingOverlayProps?:
    | ((props: {
        table: RDT_TableInstance<TData>;
      }) => HTMLAttributes<HTMLDivElement> & {
        ref?: React.Ref<HTMLDivElement>;
      })
    | (HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> });
  tableProps?:
    | ((props: {
        table: RDT_TableInstance<TData>;
      }) => HTMLAttributes<HTMLTableElement> & {
        ref?: React.Ref<HTMLTableElement>;
      })
    | (HTMLAttributes<HTMLTableElement> & {
        ref?: React.Ref<HTMLTableElement>;
      });
  tableBodyProps?:
    | ((props: {
        table: RDT_TableInstance<TData>;
      }) => HTMLAttributes<HTMLTableSectionElement> & {
        ref?: React.Ref<HTMLTableSectionElement>;
      })
    | (HTMLAttributes<HTMLTableSectionElement> & {
        ref?: React.Ref<HTMLTableSectionElement>;
      });
  tableHeadProps?:
    | ((props: {
        table: RDT_TableInstance<TData>;
      }) => HTMLAttributes<HTMLTableSectionElement> & {
        ref?: React.Ref<HTMLTableSectionElement>;
      })
    | (HTMLAttributes<HTMLTableSectionElement> & {
        ref?: React.Ref<HTMLTableSectionElement>;
      });
  tableFooterProps?:
    | ((props: {
        table: RDT_TableInstance<TData>;
      }) => HTMLAttributes<HTMLTableSectionElement> & {
        ref?: React.Ref<HTMLTableSectionElement>;
      })
    | (HTMLAttributes<HTMLTableSectionElement> & {
        ref?: React.Ref<HTMLTableSectionElement>;
      });
  tableRowProps?:
    | ((props: {
        row: RDT_Row<TData>;
        staticRowIndex: number;
        table: RDT_TableInstance<TData>;
      }) => HTMLAttributes<HTMLTableRowElement>)
    | HTMLAttributes<HTMLTableRowElement>;
  tableCellProps?:
    | ((props: {
        cell: RDT_Cell<TData>;
        column: RDT_Column<TData>;
        row: RDT_Row<TData>;
        table: RDT_TableInstance<TData>;
      }) => TdHTMLAttributes<HTMLTableCellElement>)
    | TdHTMLAttributes<HTMLTableCellElement>;

  // Component props - React Aria Components
  buttonProps?: ButtonProps;
  checkboxProps?: CheckboxProps;
  dialogProps?: DialogProps;
  menuProps?: MenuProps<object>;
  progressBarProps?: ProgressBarProps;
  searchFieldProps?: SearchFieldProps;
  selectProps?: SelectProps<object>;
  textFieldProps?: TextFieldProps;
  tooltipProps?: TooltipProps;

  // Modal and detail panel props
  createRowModalProps?:
    | ((props: {
        row: RDT_Row<TData>;
        table: RDT_TableInstance<TData>;
      }) => HTMLAttributes<HTMLDivElement>)
    | HTMLAttributes<HTMLDivElement>;
  editRowModalProps?:
    | ((props: {
        row: RDT_Row<TData>;
        table: RDT_TableInstance<TData>;
      }) => HTMLAttributes<HTMLDivElement>)
    | HTMLAttributes<HTMLDivElement>;
  detailPanelProps?:
    | ((props: {
        row: RDT_Row<TData>;
        table: RDT_TableInstance<TData>;
      }) => TdHTMLAttributes<HTMLTableCellElement>)
    | TdHTMLAttributes<HTMLTableCellElement>;

  // Theme customization
  matchHighlightColor?: string;
}
