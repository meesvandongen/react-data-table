import {
  type HTMLAttributes,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  type RDT_Column,
  type RDT_RowData,
  type RDT_TableInstance,
  type RDT_VisibilityState,
} from '../../types';
import { getDefaultColumnOrderIds } from '../../utils/displayColumn.utils';
import { RDT_ShowHideColumnsMenuItems } from './RDT_ShowHideColumnsMenuItems';
import styles from './menus.module.css';

export interface RDT_ShowHideColumnsMenuProps<TData extends RDT_RowData>
  extends HTMLAttributes<HTMLDivElement> {
  anchorEl: HTMLElement | null;
  isSubMenu?: boolean;
  setAnchorEl: (anchorEl: HTMLElement | null) => void;
  table: RDT_TableInstance<TData>;
}

export const RDT_ShowHideColumnsMenu = <TData extends RDT_RowData>({
  anchorEl,
  setAnchorEl,
  table,
  className,
  style,
  ...rest
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
  const menuRef = useRef<HTMLDivElement>(null);
  const [hoveredColumn, setHoveredColumn] = useState<RDT_Column<TData> | null>(
    null,
  );

  // Calculate menu position
  const menuPosition = useMemo(() => {
    if (!anchorEl) return null;
    const rect = anchorEl.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const menuWidth = 280;
    const menuHeight = 400;

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

    return { top, left };
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

  if (!anchorEl || !menuPosition) return null;

  const menuClassName = [styles.menu, styles.showHideColumnsMenu, className]
    .filter(Boolean)
    .join(' ');

  return (
    <>
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
      </div>
    </>
  );
};
