import { useMemo, useRef, useState } from 'react';
import { useReactTable } from '@tanstack/react-table';
import {
  type RDT_Cell,
  type RDT_Column,
  type RDT_ColumnDef,
  type RDT_ColumnFilterFnsState,
  type RDT_ColumnOrderState,
  type RDT_ColumnSizingInfoState,
  type RDT_DefinedTableOptions,
  type RDT_DensityState,
  type RDT_FilterOption,
  type RDT_GroupingState,
  type RDT_PaginationState,
  type RDT_Row,
  type RDT_RowData,
  type RDT_StatefulTableOptions,
  type RDT_TableInstance,
  type RDT_TableState,
  type RDT_Updater,
} from '../types';
import {
  getAllLeafColumnDefs,
  getColumnId,
  getDefaultColumnFilterFn,
  prepareColumns,
} from '../utils/column.utils';
import {
  getDefaultColumnOrderIds,
  showRowActionsColumn,
  showRowDragColumn,
  showRowExpandColumn,
  showRowNumbersColumn,
  showRowPinningColumn,
  showRowSelectionColumn,
  showRowSpacerColumn,
} from '../utils/displayColumn.utils';
import { createRow } from '../utils/tanstack.helpers';
import { getRDT_RowActionsColumnDef } from './display-columns/getRDT_RowActionsColumnDef';
import { getRDT_RowDragColumnDef } from './display-columns/getRDT_RowDragColumnDef';
import { getRDT_RowExpandColumnDef } from './display-columns/getRDT_RowExpandColumnDef';
import { getRDT_RowNumbersColumnDef } from './display-columns/getRDT_RowNumbersColumnDef';
import { getRDT_RowPinningColumnDef } from './display-columns/getRDT_RowPinningColumnDef';
import { getRDT_RowSelectColumnDef } from './display-columns/getRDT_RowSelectColumnDef';
import { getRDT_RowSpacerColumnDef } from './display-columns/getRDT_RowSpacerColumnDef';
import { useRDT_Effects } from './useRDT_Effects';

/**
 * The RDT hook that wraps the TanStack useReactTable hook and adds additional functionality
 * @param definedTableOptions - table options with proper defaults set
 * @returns the RDT table instance
 */
export const useRDT_TableInstance = <TData extends RDT_RowData>(
  definedTableOptions: RDT_DefinedTableOptions<TData>,
): RDT_TableInstance<TData> => {
  const lastSelectedRowId = useRef<null | string>(null);
  const actionCellRef = useRef<HTMLTableCellElement>(null);
  const bottomToolbarRef = useRef<HTMLDivElement>(null);
  const editInputRefs = useRef<Record<string, HTMLInputElement>>({});
  const filterInputRefs = useRef<Record<string, HTMLInputElement>>({});
  const filterPopoverAnchorEls = useRef<Record<string, HTMLElement | null>>({});
  const searchInputRef = useRef<HTMLInputElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const tableHeadCellRefs = useRef<Record<string, HTMLTableCellElement>>({});
  const tablePaperRef = useRef<HTMLDivElement>(null);
  const topToolbarRef = useRef<HTMLDivElement>(null);
  const tableHeadRef = useRef<HTMLTableSectionElement>(null);
  const tableFooterRef = useRef<HTMLTableSectionElement>(null);

  //transform initial state with proper column order
  const initialState: Partial<RDT_TableState<TData>> = useMemo(() => {
    const initState = definedTableOptions.initialState ?? {};
    initState.columnOrder =
      initState.columnOrder ??
      getDefaultColumnOrderIds({
        ...definedTableOptions,
        state: {
          ...definedTableOptions.initialState,
          ...definedTableOptions.state,
        },
      } as RDT_StatefulTableOptions<TData>);
    initState.globalFilterFn = definedTableOptions.globalFilterFn ?? 'fuzzy';
    return initState;
  }, []);

  definedTableOptions.initialState = initialState;

  const [actionCell, setActionCell] = useState<RDT_Cell<TData> | null>(
    initialState.actionCell ?? null,
  );
  const [creatingRow, _setCreatingRow] = useState<RDT_Row<TData> | null>(
    initialState.creatingRow ?? null,
  );
  const [columnFilterFns, setColumnFilterFns] =
    useState<RDT_ColumnFilterFnsState>(() =>
      Object.assign(
        {},
        ...getAllLeafColumnDefs(
          definedTableOptions.columns as RDT_ColumnDef<TData>[],
        ).map((col) => ({
          [getColumnId(col)]:
            col.filterFn instanceof Function
              ? (col.filterFn.name ?? 'custom')
              : (col.filterFn ??
                initialState?.columnFilterFns?.[getColumnId(col)] ??
                getDefaultColumnFilterFn(col)),
        })),
      ),
    );
  const [columnOrder, onColumnOrderChange] = useState<RDT_ColumnOrderState>(
    initialState.columnOrder ?? [],
  );
  const [columnSizingInfo, onColumnSizingInfoChange] =
    useState<RDT_ColumnSizingInfoState>(
      initialState.columnSizingInfo ?? ({} as RDT_ColumnSizingInfoState),
    );
  const [density, setDensity] = useState<RDT_DensityState>(
    initialState?.density ?? 'comfortable',
  );
  const [draggingColumn, setDraggingColumn] =
    useState<RDT_Column<TData> | null>(initialState.draggingColumn ?? null);
  const [draggingRow, setDraggingRow] = useState<RDT_Row<TData> | null>(
    initialState.draggingRow ?? null,
  );
  const [editingCell, setEditingCell] = useState<RDT_Cell<TData> | null>(
    initialState.editingCell ?? null,
  );
  const [editingRow, setEditingRow] = useState<RDT_Row<TData> | null>(
    initialState.editingRow ?? null,
  );
  const [globalFilterFn, setGlobalFilterFn] = useState<RDT_FilterOption>(
    initialState.globalFilterFn ?? 'fuzzy',
  );
  const [grouping, onGroupingChange] = useState<RDT_GroupingState>(
    initialState.grouping ?? [],
  );
  const [hoveredColumn, setHoveredColumn] = useState<Partial<
    RDT_Column<TData>
  > | null>(initialState.hoveredColumn ?? null);
  const [hoveredColumnDropPosition, setHoveredColumnDropPosition] = useState<
    'before' | 'after' | null
  >(initialState.hoveredColumnDropPosition ?? null);
  const [hoveredRow, setHoveredRow] = useState<Partial<RDT_Row<TData>> | null>(
    initialState.hoveredRow ?? null,
  );
  const [hoveredRowDropPosition, setHoveredRowDropPosition] = useState<
    'before' | 'after' | null
  >(initialState.hoveredRowDropPosition ?? null);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(
    initialState?.isFullScreen ?? false,
  );
  const [pagination, onPaginationChange] = useState<RDT_PaginationState>(
    initialState?.pagination ?? { pageIndex: 0, pageSize: 10 },
  );
  const [showAlertBanner, setShowAlertBanner] = useState<boolean>(
    initialState?.showAlertBanner ?? false,
  );
  const [showColumnFilters, setShowColumnFilters] = useState<boolean>(
    initialState?.showColumnFilters ?? false,
  );
  const [showGlobalFilter, setShowGlobalFilter] = useState<boolean>(
    initialState?.showGlobalFilter ?? false,
  );
  const [showToolbarDropZone, setShowToolbarDropZone] = useState<boolean>(
    initialState?.showToolbarDropZone ?? false,
  );

  definedTableOptions.state = {
    actionCell,
    columnFilterFns,
    columnOrder,
    columnSizingInfo,
    creatingRow,
    density,
    draggingColumn,
    draggingRow,
    editingCell,
    editingRow,
    globalFilterFn,
    grouping,
    hoveredColumn,
    hoveredColumnDropPosition,
    hoveredRow,
    hoveredRowDropPosition,
    isFullScreen,
    pagination,
    showAlertBanner,
    showColumnFilters,
    showGlobalFilter,
    showToolbarDropZone,
    ...definedTableOptions.state,
  };

  //The table options now include all state needed to help determine column visibility and order logic
  const statefulTableOptions =
    definedTableOptions as RDT_StatefulTableOptions<TData>;

  //don't recompute columnDefs while resizing column or dragging column/row
  const columnDefsRef = useRef<RDT_ColumnDef<TData>[]>([]);
  statefulTableOptions.columns =
    statefulTableOptions.state.columnSizingInfo.isResizingColumn ||
    statefulTableOptions.state.draggingColumn ||
    statefulTableOptions.state.draggingRow
      ? columnDefsRef.current
      : prepareColumns({
          columnDefs: [
            ...([
              showRowPinningColumn(statefulTableOptions) &&
                getRDT_RowPinningColumnDef(statefulTableOptions),
              showRowDragColumn(statefulTableOptions) &&
                getRDT_RowDragColumnDef(statefulTableOptions),
              showRowActionsColumn(statefulTableOptions) &&
                getRDT_RowActionsColumnDef(statefulTableOptions),
              showRowExpandColumn(statefulTableOptions) &&
                getRDT_RowExpandColumnDef(statefulTableOptions),
              showRowSelectionColumn(statefulTableOptions) &&
                getRDT_RowSelectColumnDef(statefulTableOptions),
              showRowNumbersColumn(statefulTableOptions) &&
                getRDT_RowNumbersColumnDef(statefulTableOptions),
            ].filter(Boolean) as RDT_ColumnDef<TData>[]),
            ...statefulTableOptions.columns,
            ...([
              showRowSpacerColumn(statefulTableOptions) &&
                getRDT_RowSpacerColumnDef(statefulTableOptions),
            ].filter(Boolean) as RDT_ColumnDef<TData>[]),
          ],
          tableOptions: statefulTableOptions,
        });
  columnDefsRef.current = statefulTableOptions.columns;

  //if loading, generate blank rows to show skeleton loaders
  statefulTableOptions.data = useMemo(
    () =>
      (statefulTableOptions.state.isLoading ||
        statefulTableOptions.state.showSkeletons) &&
      !statefulTableOptions.data.length
        ? [
            ...Array(
              Math.min(statefulTableOptions.state.pagination.pageSize, 20),
            ).fill(null),
          ].map(() =>
            Object.assign(
              {},
              ...getAllLeafColumnDefs(statefulTableOptions.columns).map(
                (col) => ({
                  [getColumnId(col)]: null,
                }),
              ),
            ),
          )
        : statefulTableOptions.data,
    [
      statefulTableOptions.data,
      statefulTableOptions.state.isLoading,
      statefulTableOptions.state.showSkeletons,
    ],
  );

  //@ts-expect-error
  const table = useReactTable({
    onColumnOrderChange,
    onColumnSizingInfoChange,
    onGroupingChange,
    onPaginationChange,
    ...statefulTableOptions,
    globalFilterFn: statefulTableOptions.filterFns?.[globalFilterFn ?? 'fuzzy'],
  }) as RDT_TableInstance<TData>;

  table.refs = {
    actionCellRef,
    bottomToolbarRef,
    editInputRefs,
    filterInputRefs,
    filterPopoverAnchorEls,
    lastSelectedRowId,
    searchInputRef,
    tableContainerRef,
    tableFooterRef,
    tableHeadCellRefs,
    tableHeadRef,
    tablePaperRef,
    topToolbarRef,
  };

  table.setActionCell =
    statefulTableOptions.onActionCellChange ?? setActionCell;
  table.setCreatingRow = (row: RDT_Updater<RDT_Row<TData> | null | true>) => {
    let _row = row;
    if (row === true) {
      _row = createRow(table);
    }
    statefulTableOptions?.onCreatingRowChange?.(
      _row as RDT_Row<TData> | null,
    ) ?? _setCreatingRow(_row as RDT_Row<TData> | null);
  };
  table.setColumnFilterFns =
    statefulTableOptions.onColumnFilterFnsChange ?? setColumnFilterFns;
  table.setDensity = statefulTableOptions.onDensityChange ?? setDensity;
  table.setDraggingColumn =
    statefulTableOptions.onDraggingColumnChange ?? setDraggingColumn;
  table.setDraggingRow =
    statefulTableOptions.onDraggingRowChange ?? setDraggingRow;
  table.setEditingCell =
    statefulTableOptions.onEditingCellChange ?? setEditingCell;
  table.setEditingRow =
    statefulTableOptions.onEditingRowChange ?? setEditingRow;
  table.setGlobalFilterFn =
    statefulTableOptions.onGlobalFilterFnChange ?? setGlobalFilterFn;
  table.setHoveredColumn =
    statefulTableOptions.onHoveredColumnChange ?? setHoveredColumn;
  table.setHoveredColumnDropPosition =
    statefulTableOptions.onHoveredColumnDropPositionChange ??
    setHoveredColumnDropPosition;
  table.setHoveredRow =
    statefulTableOptions.onHoveredRowChange ?? setHoveredRow;
  table.setHoveredRowDropPosition =
    statefulTableOptions.onHoveredRowDropPositionChange ??
    setHoveredRowDropPosition;
  table.setIsFullScreen =
    statefulTableOptions.onIsFullScreenChange ?? setIsFullScreen;
  table.setShowAlertBanner =
    statefulTableOptions.onShowAlertBannerChange ?? setShowAlertBanner;
  table.setShowColumnFilters =
    statefulTableOptions.onShowColumnFiltersChange ?? setShowColumnFilters;
  table.setShowGlobalFilter =
    statefulTableOptions.onShowGlobalFilterChange ?? setShowGlobalFilter;
  table.setShowToolbarDropZone =
    statefulTableOptions.onShowToolbarDropZoneChange ?? setShowToolbarDropZone;
  table.setFilterPopoverAnchorEl = (
    columnId: string,
    anchorEl: HTMLElement | null,
  ) => {
    filterPopoverAnchorEls.current[columnId] = anchorEl;
  };

  useRDT_Effects(table);

  return table;
};
