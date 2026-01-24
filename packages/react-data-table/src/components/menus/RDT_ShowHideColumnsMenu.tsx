import { useMemo, useState } from 'react';
import { Dialog, DialogTrigger, Popover } from 'react-aria-components';
import clsx from 'clsx';
import {
  type RDT_Column,
  type RDT_RowData,
  type RDT_TableInstance,
  type RDT_VisibilityState,
} from '../../types';
import { getDefaultColumnOrderIds } from '../../utils/displayColumn.utils';
import { RDT_ShowHideColumnsMenuItems } from './RDT_ShowHideColumnsMenuItems';
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

  const { columnOrder, columnPinning } = getState();
  const [hoveredColumn, setHoveredColumn] = useState<RDT_Column<TData> | null>(
    null,
  );

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

  const isNestedColumns = allColumns.some(
    (col) => col.columnDef.columnDefType === 'group',
  );

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

          {/* Column list */}
          <div className={styles.showHideColumnsMenuList}>
            {allColumns.map((column, index) => (
              <RDT_ShowHideColumnsMenuItems
                allColumns={allColumns}
                column={column}
                hoveredColumn={hoveredColumn}
                isNestedColumns={isNestedColumns}
                key={`${index}-${column.id}`}
                setHoveredColumn={setHoveredColumn}
                table={table}
              />
            ))}
          </div>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
};
