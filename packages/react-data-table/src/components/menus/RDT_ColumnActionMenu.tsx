import {
  type HTMLAttributes,
  type MouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  type RDT_Header,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import { RDT_ActionMenuItem } from './RDT_ActionMenuItem';
import { RDT_FilterOptionMenu } from './RDT_FilterOptionMenu';
import styles from './menus.module.css';

export interface RDT_ColumnActionMenuProps<TData extends RDT_RowData>
  extends HTMLAttributes<HTMLDivElement> {
  anchorEl: HTMLElement | null;
  header: RDT_Header<TData>;
  setAnchorEl: (anchorEl: HTMLElement | null) => void;
  table: RDT_TableInstance<TData>;
}

export const RDT_ColumnActionMenu = <TData extends RDT_RowData>({
  anchorEl,
  header,
  setAnchorEl,
  table,
  className,
  style,
  ...rest
}: RDT_ColumnActionMenuProps<TData>) => {
  const {
    getAllLeafColumns,
    getState,
    options: {
      columnFilterDisplayMode,
      columnFilterModeOptions,
      enableColumnFilterModes,
      enableColumnFilters,
      enableColumnPinning,
      enableColumnResizing,
      enableGrouping,
      enableHiding,
      enableSorting,
      enableSortingRemoval,
      icons: {
        ClearAllIcon,
        FilterListIcon,
        FilterListOffIcon,
        PushPinIcon,
        RestartAltIcon,
        SortIcon,
        ViewColumnIcon,
        VisibilityOffIcon,
      },
      localization,
      renderColumnActionsMenuItems,
    },
    refs: { filterInputRefs },
    setColumnFilterFns,
    setColumnOrder,
    setColumnSizingInfo,
    setShowColumnFilters,
  } = table;

  const { column } = header;
  const { columnDef } = column;
  const { columnSizing, columnVisibility, showColumnFilters } = getState();
  const columnFilterValue = column.getFilterValue();

  const menuRef = useRef<HTMLDivElement>(null);
  const [filterMenuAnchorEl, setFilterMenuAnchorEl] =
    useState<HTMLElement | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  // Calculate menu position when anchor changes
  useEffect(() => {
    if (anchorEl) {
      const rect = anchorEl.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const menuWidth = 200; // Approximate menu width
      const menuHeight = 300; // Approximate max menu height

      let left = rect.left;
      let top = rect.bottom + 4;

      // Adjust if menu would overflow right edge
      if (left + menuWidth > viewportWidth) {
        left = viewportWidth - menuWidth - 8;
      }

      // Adjust if menu would overflow bottom edge
      if (top + menuHeight > viewportHeight) {
        top = rect.top - menuHeight - 4;
        if (top < 0) top = 8;
      }

      setMenuPosition({ top, left });
    } else {
      setMenuPosition(null);
    }
  }, [anchorEl]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!anchorEl) return;

    const handleClickOutside = (event: Event) => {
      const target = event.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setAnchorEl(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [anchorEl, setAnchorEl]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!anchorEl) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAnchorEl(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [anchorEl, setAnchorEl]);

  if (!anchorEl || !menuPosition) return null;

  const handleClearSort = () => {
    column.clearSorting();
    setAnchorEl(null);
  };

  const handleSortAsc = () => {
    column.toggleSorting(false);
    setAnchorEl(null);
  };

  const handleSortDesc = () => {
    column.toggleSorting(true);
    setAnchorEl(null);
  };

  const handleResetColumnSize = () => {
    setColumnSizingInfo((old) => ({ ...old, isResizingColumn: false }));
    column.resetSize();
    setAnchorEl(null);
  };

  const handleHideColumn = () => {
    column.toggleVisibility(false);
    setAnchorEl(null);
  };

  const handlePinColumn = (pinDirection: 'left' | 'right' | false) => {
    column.pin(pinDirection);
    setAnchorEl(null);
  };

  const handleGroupByColumn = () => {
    column.toggleGrouping();
    setColumnOrder((old: string[]) => ['rdt-row-expand', ...old]);
    setAnchorEl(null);
  };

  const handleClearFilter = () => {
    column.setFilterValue(undefined);
    setAnchorEl(null);
    if (['empty', 'notEmpty'].includes(columnDef._filterFn as string)) {
      const allowedOptions =
        columnDef?.columnFilterModeOptions ?? columnFilterModeOptions;
      setColumnFilterFns((prev) => ({
        ...prev,
        [header.id]: allowedOptions?.[0] ?? 'fuzzy',
      }));
    }
  };

  const handleFilterByColumn = () => {
    setShowColumnFilters(true);
    queueMicrotask(() => filterInputRefs.current?.[`${column.id}-0`]?.focus());
    setAnchorEl(null);
  };

  const handleShowAllColumns = () => {
    getAllLeafColumns()
      .filter((col) => col.columnDef.enableHiding !== false)
      .forEach((col) => col.toggleVisibility(true));
    setAnchorEl(null);
  };

  const handleOpenFilterModeMenu = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setFilterMenuAnchorEl(event.currentTarget);
  };

  const isSelectFilter = !!columnDef.filterSelectOptions;
  const allowedColumnFilterOptions =
    columnDef?.columnFilterModeOptions ?? columnFilterModeOptions;
  const showFilterModeSubMenu =
    enableColumnFilterModes &&
    columnDef.enableColumnFilterModes !== false &&
    !isSelectFilter &&
    (allowedColumnFilterOptions === undefined ||
      !!allowedColumnFilterOptions?.length);

  const internalColumnMenuItems = [
    // Sorting options
    ...(enableSorting && column.getCanSort()
      ? [
          enableSortingRemoval !== false && (
            <RDT_ActionMenuItem
              disabled={column.getIsSorted() === false}
              icon={<ClearAllIcon />}
              key="clear-sort"
              label={localization.clearSort}
              onClick={handleClearSort}
              table={table}
            />
          ),
          <RDT_ActionMenuItem
            disabled={column.getIsSorted() === 'asc'}
            icon={
              <SortIcon style={{ transform: 'rotate(180deg) scaleX(-1)' }} />
            }
            key="sort-asc"
            label={
              localization.sortByColumnAsc?.replace(
                '{column}',
                String(columnDef.header),
              ) ?? `Sort by ${columnDef.header} ascending`
            }
            onClick={handleSortAsc}
            table={table}
          />,
          <RDT_ActionMenuItem
            disabled={column.getIsSorted() === 'desc'}
            divider={
              (enableColumnFilters && column.getCanFilter()) ||
              (enableGrouping && column.getCanGroup()) ||
              enableHiding
            }
            icon={<SortIcon />}
            key="sort-desc"
            label={
              localization.sortByColumnDesc?.replace(
                '{column}',
                String(columnDef.header),
              ) ?? `Sort by ${columnDef.header} descending`
            }
            onClick={handleSortDesc}
            table={table}
          />,
        ].filter(Boolean)
      : []),

    // Filter options
    ...(enableColumnFilters && column.getCanFilter()
      ? [
          <RDT_ActionMenuItem
            disabled={
              !columnFilterValue ||
              (Array.isArray(columnFilterValue) &&
                !columnFilterValue.filter((value) => value).length)
            }
            icon={<FilterListOffIcon />}
            key="clear-filter"
            label={localization.clearFilter}
            onClick={handleClearFilter}
            table={table}
          />,
          columnFilterDisplayMode === 'subheader' && (
            <RDT_ActionMenuItem
              disabled={showColumnFilters && !enableColumnFilterModes}
              divider={
                (enableGrouping && column.getCanGroup()) ||
                enableColumnPinning ||
                enableHiding
              }
              icon={<FilterListIcon />}
              key="filter-by"
              label={
                localization.filterByColumn?.replace(
                  '{column}',
                  String(columnDef.header),
                ) ?? `Filter by ${columnDef.header}`
              }
              onClick={
                showColumnFilters
                  ? handleOpenFilterModeMenu
                  : handleFilterByColumn
              }
              onOpenSubMenu={
                showFilterModeSubMenu ? handleOpenFilterModeMenu : undefined
              }
              table={table}
            />
          ),
        ].filter(Boolean)
      : []),

    // Grouping options
    ...(enableGrouping && column.getCanGroup()
      ? [
          <RDT_ActionMenuItem
            divider={enableColumnPinning || enableHiding}
            icon={<ViewColumnIcon />}
            key="group-by"
            label={
              (column.getIsGrouped()
                ? localization.ungroupByColumn
                : localization.groupByColumn
              )?.replace('{column}', String(columnDef.header)) ??
              `${column.getIsGrouped() ? 'Ungroup' : 'Group'} by ${columnDef.header}`
            }
            onClick={handleGroupByColumn}
            table={table}
          />,
        ]
      : []),

    // Pinning options
    ...(enableColumnPinning && column.getCanPin()
      ? [
          <RDT_ActionMenuItem
            disabled={column.getIsPinned() === 'left' || !column.getCanPin()}
            icon={<PushPinIcon style={{ transform: 'rotate(90deg)' }} />}
            key="pin-left"
            label={localization.pinToLeft}
            onClick={() => handlePinColumn('left')}
            table={table}
          />,
          <RDT_ActionMenuItem
            disabled={column.getIsPinned() === 'right' || !column.getCanPin()}
            icon={<PushPinIcon style={{ transform: 'rotate(-90deg)' }} />}
            key="pin-right"
            label={localization.pinToRight}
            onClick={() => handlePinColumn('right')}
            table={table}
          />,
          <RDT_ActionMenuItem
            disabled={!column.getIsPinned()}
            divider={enableHiding || enableColumnResizing}
            icon={<PushPinIcon />}
            key="unpin"
            label={localization.unpin}
            onClick={() => handlePinColumn(false)}
            table={table}
          />,
        ]
      : []),

    // Resizing options
    ...(enableColumnResizing && column.getCanResize()
      ? [
          <RDT_ActionMenuItem
            disabled={columnSizing[column.id] === undefined}
            divider={enableHiding}
            icon={<RestartAltIcon />}
            key="reset-size"
            label={localization.resetColumnSize}
            onClick={handleResetColumnSize}
            table={table}
          />,
        ]
      : []),

    // Hiding options
    ...(enableHiding
      ? [
          <RDT_ActionMenuItem
            disabled={!column.getCanHide()}
            icon={<VisibilityOffIcon />}
            key="hide"
            label={
              localization.hideColumn?.replace(
                '{column}',
                String(columnDef.header),
              ) ?? `Hide ${columnDef.header}`
            }
            onClick={handleHideColumn}
            table={table}
          />,
          <RDT_ActionMenuItem
            disabled={
              !Object.values(columnVisibility).filter((visible) => !visible)
                .length
            }
            icon={<ViewColumnIcon />}
            key="show-all"
            label={localization.showAllColumns}
            onClick={handleShowAllColumns}
            table={table}
          />,
        ]
      : []),
  ].filter(Boolean);

  // Allow custom rendering of menu items
  const menuItems =
    columnDef.renderColumnActionsMenuItems?.({
      closeMenu: () => setAnchorEl(null),
      column,
      internalColumnMenuItems,
      table,
    }) ??
    renderColumnActionsMenuItems?.({
      closeMenu: () => setAnchorEl(null),
      column,
      internalColumnMenuItems,
      table,
    }) ??
    internalColumnMenuItems;

  const menuClassName = [styles.menu, styles.columnActionMenu, className]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      {/* Backdrop to capture clicks outside */}
      <div
        className={styles.menuBackdrop}
        onClick={() => setAnchorEl(null)}
        aria-hidden="true"
      />
      <div
        ref={menuRef}
        role="menu"
        className={menuClassName}
        style={{
          top: menuPosition.top,
          left: menuPosition.left,
          ...style,
        }}
        {...rest}
      >
        {menuItems}
      </div>
      {/* Filter mode submenu */}
      {showFilterModeSubMenu && filterMenuAnchorEl && (
        <RDT_FilterOptionMenu
          anchorEl={filterMenuAnchorEl}
          header={header}
          onSelect={handleFilterByColumn}
          setAnchorEl={setFilterMenuAnchorEl}
          table={table}
        />
      )}
    </>
  );
};
