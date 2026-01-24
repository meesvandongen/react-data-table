import { type MouseEvent, useState } from 'react';
import { Menu, MenuItem, MenuTrigger, Popover } from 'react-aria-components';
import {
  type RDT_Header,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import { RDT_FilterOptionMenu } from './RDT_FilterOptionMenu';
import styles from './menus.module.css';

export interface RDT_ColumnActionMenuProps<TData extends RDT_RowData> {
  anchorEl: HTMLElement | null;
  className?: string;
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
  const { columnSizing, columnVisibility, density, showColumnFilters } =
    getState();
  const columnFilterValue = column.getFilterValue();

  const [filterMenuAnchorEl, setFilterMenuAnchorEl] =
    useState<HTMLElement | null>(null);

  const isDense = density === 'compact';

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClearSort = () => {
    column.clearSorting();
    handleClose();
  };

  const handleSortAsc = () => {
    column.toggleSorting(false);
    handleClose();
  };

  const handleSortDesc = () => {
    column.toggleSorting(true);
    handleClose();
  };

  const handleResetColumnSize = () => {
    setColumnSizingInfo((old) => ({ ...old, isResizingColumn: false }));
    column.resetSize();
    handleClose();
  };

  const handleHideColumn = () => {
    column.toggleVisibility(false);
    handleClose();
  };

  const handlePinColumn = (pinDirection: 'left' | 'right' | false) => {
    column.pin(pinDirection);
    handleClose();
  };

  const handleGroupByColumn = () => {
    column.toggleGrouping();
    setColumnOrder((old: string[]) => ['rdt-row-expand', ...old]);
    handleClose();
  };

  const handleClearFilter = () => {
    column.setFilterValue(undefined);
    handleClose();
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
    handleClose();
  };

  const handleShowAllColumns = () => {
    getAllLeafColumns()
      .filter((col) => col.columnDef.enableHiding !== false)
      .forEach((col) => col.toggleVisibility(true));
    handleClose();
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

  // Build menu items for custom rendering
  const internalColumnMenuItems = [
    // Sorting options
    ...(enableSorting && column.getCanSort()
      ? [
          enableSortingRemoval !== false && {
            key: 'clear-sort',
            disabled: column.getIsSorted() === false,
            icon: <ClearAllIcon />,
            label: localization.clearSort,
            onClick: handleClearSort,
          },
          {
            key: 'sort-asc',
            disabled: column.getIsSorted() === 'asc',
            icon: (
              <SortIcon style={{ transform: 'rotate(180deg) scaleX(-1)' }} />
            ),
            label:
              localization.sortByColumnAsc?.replace(
                '{column}',
                String(columnDef.header),
              ) ?? `Sort by ${columnDef.header} ascending`,
            onClick: handleSortAsc,
          },
          {
            key: 'sort-desc',
            disabled: column.getIsSorted() === 'desc',
            icon: <SortIcon />,
            label:
              localization.sortByColumnDesc?.replace(
                '{column}',
                String(columnDef.header),
              ) ?? `Sort by ${columnDef.header} descending`,
            onClick: handleSortDesc,
            divider:
              (enableColumnFilters && column.getCanFilter()) ||
              (enableGrouping && column.getCanGroup()) ||
              enableHiding,
          },
        ].filter(Boolean)
      : []),

    // Filter options
    ...(enableColumnFilters && column.getCanFilter()
      ? [
          {
            key: 'clear-filter',
            disabled:
              !columnFilterValue ||
              (Array.isArray(columnFilterValue) &&
                !columnFilterValue.filter((value) => value).length),
            icon: <FilterListOffIcon />,
            label: localization.clearFilter,
            onClick: handleClearFilter,
          },
          columnFilterDisplayMode === 'subheader' && {
            key: 'filter-by',
            disabled: showColumnFilters && !enableColumnFilterModes,
            icon: <FilterListIcon />,
            label:
              localization.filterByColumn?.replace(
                '{column}',
                String(columnDef.header),
              ) ?? `Filter by ${columnDef.header}`,
            onClick: showColumnFilters
              ? handleOpenFilterModeMenu
              : handleFilterByColumn,
            onOpenSubMenu: showFilterModeSubMenu
              ? handleOpenFilterModeMenu
              : undefined,
            divider:
              (enableGrouping && column.getCanGroup()) ||
              enableColumnPinning ||
              enableHiding,
          },
        ].filter(Boolean)
      : []),

    // Grouping options
    ...(enableGrouping && column.getCanGroup()
      ? [
          {
            key: 'group-by',
            icon: <ViewColumnIcon />,
            label:
              (column.getIsGrouped()
                ? localization.ungroupByColumn
                : localization.groupByColumn
              )?.replace('{column}', String(columnDef.header)) ??
              `${column.getIsGrouped() ? 'Ungroup' : 'Group'} by ${columnDef.header}`,
            onClick: handleGroupByColumn,
            divider: enableColumnPinning || enableHiding,
          },
        ]
      : []),

    // Pinning options
    ...(enableColumnPinning && column.getCanPin()
      ? [
          {
            key: 'pin-left',
            disabled: column.getIsPinned() === 'left' || !column.getCanPin(),
            icon: <PushPinIcon style={{ transform: 'rotate(90deg)' }} />,
            label: localization.pinToLeft,
            onClick: () => handlePinColumn('left'),
          },
          {
            key: 'pin-right',
            disabled: column.getIsPinned() === 'right' || !column.getCanPin(),
            icon: <PushPinIcon style={{ transform: 'rotate(-90deg)' }} />,
            label: localization.pinToRight,
            onClick: () => handlePinColumn('right'),
          },
          {
            key: 'unpin',
            disabled: !column.getIsPinned(),
            icon: <PushPinIcon />,
            label: localization.unpin,
            onClick: () => handlePinColumn(false),
            divider: enableHiding || enableColumnResizing,
          },
        ]
      : []),

    // Resizing options
    ...(enableColumnResizing && column.getCanResize()
      ? [
          {
            key: 'reset-size',
            disabled: columnSizing[column.id] === undefined,
            icon: <RestartAltIcon />,
            label: localization.resetColumnSize,
            onClick: handleResetColumnSize,
            divider: enableHiding,
          },
        ]
      : []),

    // Hiding options
    ...(enableHiding
      ? [
          {
            key: 'hide',
            disabled: !column.getCanHide(),
            icon: <VisibilityOffIcon />,
            label:
              localization.hideColumn?.replace(
                '{column}',
                String(columnDef.header),
              ) ?? `Hide ${columnDef.header}`,
            onClick: handleHideColumn,
          },
          {
            key: 'show-all',
            disabled: !Object.values(columnVisibility).filter(
              (visible) => !visible,
            ).length,
            icon: <ViewColumnIcon />,
            label: localization.showAllColumns,
            onClick: handleShowAllColumns,
          },
        ]
      : []),
  ].filter(Boolean) as Array<{
    key: string;
    disabled?: boolean;
    divider?: boolean;
    icon?: React.ReactNode;
    label: string;
    onClick?: () => void;
    onOpenSubMenu?: (event: MouseEvent<HTMLButtonElement>) => void;
  }>;

  // Allow custom rendering of menu items (return JSX elements for backwards compatibility)
  const customMenuItems =
    columnDef.renderColumnActionsMenuItems?.({
      closeMenu: handleClose,
      column,
      internalColumnMenuItems: internalColumnMenuItems.map((item) => (
        <MenuItem
          key={item.key}
          className={[
            styles.menuItem,
            isDense && styles.menuItemDense,
            item.divider && styles.menuItemDivider,
          ]
            .filter(Boolean)
            .join(' ')}
          isDisabled={item.disabled}
          onAction={item.onClick}
        >
          <span className={styles.menuItemContent}>
            {item.icon && (
              <span className={styles.menuItemIcon}>{item.icon}</span>
            )}
            <span className={styles.menuItemLabel}>{item.label}</span>
          </span>
          {item.onOpenSubMenu && (
            <button
              type="button"
              className={styles.menuItemSubMenuIcon}
              onClick={item.onOpenSubMenu}
              onMouseEnter={item.onOpenSubMenu}
              aria-label="Open submenu"
            >
              <table.options.icons.ArrowRightIcon />
            </button>
          )}
        </MenuItem>
      )),
      table,
    }) ??
    renderColumnActionsMenuItems?.({
      closeMenu: handleClose,
      column,
      internalColumnMenuItems: internalColumnMenuItems.map((item) => (
        <MenuItem
          key={item.key}
          className={[
            styles.menuItem,
            isDense && styles.menuItemDense,
            item.divider && styles.menuItemDivider,
          ]
            .filter(Boolean)
            .join(' ')}
          isDisabled={item.disabled}
          onAction={item.onClick}
        >
          <span className={styles.menuItemContent}>
            {item.icon && (
              <span className={styles.menuItemIcon}>{item.icon}</span>
            )}
            <span className={styles.menuItemLabel}>{item.label}</span>
          </span>
        </MenuItem>
      )),
      table,
    });

  const menuClassName = [styles.menu, styles.columnActionMenu, className]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <MenuTrigger isOpen={!!anchorEl} onOpenChange={() => {}}>
        {/* Hidden trigger - we control open state externally */}
        <button style={{ display: 'none' }} aria-hidden>
          trigger
        </button>
        <Popover
          isOpen={!!anchorEl}
          onOpenChange={(isOpen) => {
            if (!isOpen) handleClose();
          }}
          triggerRef={{ current: anchorEl }}
          placement="bottom start"
          className={menuClassName}
        >
          <Menu
            onAction={() => {}}
            aria-label={localization.columnActions}
            className={styles.menuInner}
          >
            {customMenuItems ? (
              <>{customMenuItems}</>
            ) : (
              <>
                {internalColumnMenuItems.map((item) => (
                  <MenuItem
                    key={item.key}
                    className={[
                      styles.menuItem,
                      isDense && styles.menuItemDense,
                      item.divider && styles.menuItemDivider,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    isDisabled={item.disabled}
                    onAction={item.onClick}
                  >
                    <span className={styles.menuItemContent}>
                      {item.icon && (
                        <span className={styles.menuItemIcon}>{item.icon}</span>
                      )}
                      <span className={styles.menuItemLabel}>{item.label}</span>
                    </span>
                    {item.onOpenSubMenu && (
                      <button
                        type="button"
                        className={styles.menuItemSubMenuIcon}
                        onClick={item.onOpenSubMenu}
                        onMouseEnter={item.onOpenSubMenu}
                        aria-label="Open submenu"
                      >
                        <table.options.icons.ArrowRightIcon />
                      </button>
                    )}
                  </MenuItem>
                ))}
              </>
            )}
          </Menu>
        </Popover>
      </MenuTrigger>
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
