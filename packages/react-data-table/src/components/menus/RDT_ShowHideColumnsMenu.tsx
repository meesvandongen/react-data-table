import { useMemo } from 'react';
import {
  type Selection,
  Dialog,
  DialogTrigger,
  Menu,
  MenuItem,
  Popover,
} from 'react-aria-components';
import { Check } from 'lucide-react';
import clsx from 'clsx';
import {
  type RDT_Column,
  type RDT_RowData,
  type RDT_TableInstance,
  type RDT_VisibilityState,
} from '../../types';
import { getDefaultColumnOrderIds } from '../../utils/displayColumn.utils';
import styles from './menus.module.css';

export interface RDT_ShowHideColumnsMenuProps<TData extends RDT_RowData> {
  anchorEl: HTMLElement | null;
  className?: string;
  isSubMenu?: boolean;
  setAnchorEl: (anchorEl: HTMLElement | null) => void;
  table: RDT_TableInstance<TData>;
}

export const RDT_ShowHideColumnsMenu = <TData extends RDT_RowData>({
  anchorEl,
  setAnchorEl,
  table,
  className,
}: RDT_ShowHideColumnsMenuProps<TData>) => {
  const {
    getAllColumns,
    getAllLeafColumns,
    getCenterLeafColumns,
    getIsAllColumnsVisible,
    getIsSomeColumnsPinned,
    getIsSomeColumnsVisible,
    getLeftLeafColumns,
    getRightLeafColumns,
    getState,
    initialState,
    options: {
      enableColumnOrdering,
      enableColumnPinning,
      enableHiding,
      localization,
    },
  } = table;

  const { columnOrder, columnPinning, columnVisibility } = getState();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggleAllColumns = (value?: boolean) => {
    const updates = getAllLeafColumns()
      .filter((column) => column.columnDef.enableHiding !== false)
      .reduce((acc, column) => {
        acc[column.id] = value ?? !column.getIsVisible();
        return acc;
      }, {} as RDT_VisibilityState);

    table.setColumnVisibility((old) => ({ ...old, ...updates }));
  };

  const allColumns = useMemo(() => {
    const columns = getAllColumns();
    if (
      columnOrder.length > 0 &&
      !columns.some((col) => col.columnDef.columnDefType === 'group')
    ) {
      return [
        ...getLeftLeafColumns(),
        ...Array.from(new Set(columnOrder)).map((colId) =>
          getCenterLeafColumns().find((col) => col?.id === colId),
        ),
        ...getRightLeafColumns(),
      ].filter(Boolean);
    }
    return columns;
  }, [
    columnOrder,
    columnPinning,
    getAllColumns,
    getCenterLeafColumns,
    getLeftLeafColumns,
    getRightLeafColumns,
  ]) as RDT_Column<TData>[];

  // Filter to only show columns that should appear in the menu
  const menuColumns = useMemo(() => {
    return allColumns.filter(
      (col) =>
        col.columnDef.header && col.columnDef.visibleInShowHideMenu !== false,
    );
  }, [allColumns]);

  // Compute selected keys (visible columns)
  const selectedKeys = useMemo(() => {
    return new Set(
      menuColumns.filter((col) => col.getIsVisible()).map((col) => col.id),
    );
  }, [menuColumns, columnVisibility]);

  const handleSelectionChange = (keys: Selection) => {
    if (keys === 'all') {
      // Show all columns
      handleToggleAllColumns(true);
    } else {
      const newVisibility: RDT_VisibilityState = {};
      menuColumns.forEach((col) => {
        if (col.columnDef.enableHiding !== false) {
          newVisibility[col.id] = keys.has(col.id);
        }
      });
      table.setColumnVisibility((old) => ({ ...old, ...newVisibility }));
    }
  };

  const hasColumnOrderChanged = useMemo(
    () =>
      columnOrder.length !== initialState.columnOrder.length ||
      !columnOrder.every(
        (column, index) => column === initialState.columnOrder[index],
      ),
    [columnOrder, initialState.columnOrder],
  );

  if (!anchorEl) return null;

  return (
    <DialogTrigger>
      <Popover
        isOpen={!!anchorEl}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleClose();
        }}
        triggerRef={{ current: anchorEl }}
        placement="bottom start"
        className={clsx(styles.menu, styles.showHideColumnsMenu, className)}
      >
        <Dialog
          aria-label={localization.showHideColumns ?? 'Show/Hide columns'}
          className={styles.menuDialog}
        >
          {/* Header with action buttons */}
          <div className={styles.showHideColumnsMenuHeader}>
            <span className={styles.showHideColumnsMenuTitle}>
              {localization.columns}
            </span>
            <div className={styles.showHideColumnsMenuActions}>
              {enableHiding && (
                <button
                  type="button"
                  className={styles.showHideColumnsMenuAction}
                  disabled={!getIsSomeColumnsVisible()}
                  onClick={() => handleToggleAllColumns(false)}
                >
                  {localization.hideAll}
                </button>
              )}
              {enableColumnOrdering && (
                <button
                  type="button"
                  className={styles.showHideColumnsMenuAction}
                  disabled={!hasColumnOrderChanged}
                  onClick={() =>
                    table.setColumnOrder(
                      getDefaultColumnOrderIds(table.options, true),
                    )
                  }
                >
                  {localization.resetOrder}
                </button>
              )}
              {enableColumnPinning && (
                <button
                  type="button"
                  className={styles.showHideColumnsMenuAction}
                  disabled={!getIsSomeColumnsPinned()}
                  onClick={() => table.resetColumnPinning(true)}
                >
                  {localization.unpinAll}
                </button>
              )}
              {enableHiding && (
                <button
                  type="button"
                  className={styles.showHideColumnsMenuAction}
                  disabled={getIsAllColumnsVisible()}
                  onClick={() => handleToggleAllColumns(true)}
                >
                  {localization.showAll}
                </button>
              )}
            </div>
          </div>

          {/* Column list using React Aria Menu with selection */}
          <Menu
            aria-label={localization.columns}
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={handleSelectionChange}
            className={styles.showHideColumnsMenuList}
          >
            {menuColumns.map((column) => {
              const { columnDef } = column;
              const { columnDefType } = columnDef;
              const canHide = column.getCanHide();

              return (
                <MenuItem
                  key={column.id}
                  id={column.id}
                  textValue={String(columnDef.header)}
                  isDisabled={!canHide}
                  className={styles.showHideColumnsMenuItem}
                >
                  {({ isSelected }) => (
                    <>
                      <span className={styles.showHideColumnsMenuItemCheck}>
                        {isSelected && <Check size={16} />}
                      </span>
                      <span
                        className={styles.showHideColumnsMenuItemLabel}
                        style={{
                          opacity: columnDefType !== 'display' ? 1 : 0.5,
                        }}
                      >
                        {columnDef.header}
                      </span>
                    </>
                  )}
                </MenuItem>
              );
            })}
          </Menu>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
};
