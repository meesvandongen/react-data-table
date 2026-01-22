import {
  type Dispatch,
  type DragEvent,
  type HTMLAttributes,
  type SetStateAction,
  useRef,
  useState,
} from 'react';
import {
  type RDT_Column,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import { reorderColumn } from '../../utils/column.utils';
import styles from './menus.module.css';

export interface RDT_ShowHideColumnsMenuItemsProps<TData extends RDT_RowData>
  extends HTMLAttributes<HTMLDivElement> {
  allColumns: RDT_Column<TData>[];
  column: RDT_Column<TData>;
  hoveredColumn: RDT_Column<TData> | null;
  isNestedColumns: boolean;
  setHoveredColumn: Dispatch<SetStateAction<RDT_Column<TData> | null>>;
  table: RDT_TableInstance<TData>;
}

export const RDT_ShowHideColumnsMenuItems = <TData extends RDT_RowData>({
  allColumns,
  column,
  hoveredColumn,
  isNestedColumns,
  setHoveredColumn,
  table,
  ...rest
}: RDT_ShowHideColumnsMenuItemsProps<TData>) => {
  const {
    getState,
    options: {
      enableColumnOrdering,
      enableColumnPinning,
      enableHiding,
      icons: { DragHandleIcon, PushPinIcon },
      localization,
    },
    setColumnOrder,
    setColumnPinning,
  } = table;

  const { columnOrder } = getState();
  const { columnDef } = column;
  const { columnDefType } = columnDef;

  const switchChecked = column.getIsVisible();

  const handleToggleColumnHidden = (column: RDT_Column<TData>) => {
    if (columnDefType === 'group') {
      column?.columns?.forEach?.((childColumn: RDT_Column<TData>) => {
        childColumn.toggleVisibility(!switchChecked);
      });
    } else {
      column.toggleVisibility();
    }
  };

  const menuItemRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: DragEvent<HTMLButtonElement>) => {
    setIsDragging(true);
    try {
      e.dataTransfer.setDragImage(menuItemRef.current as HTMLElement, 0, 0);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDragEnd = (_e: DragEvent<HTMLButtonElement>) => {
    setIsDragging(false);
    setHoveredColumn(null);
    if (hoveredColumn) {
      const reorderedColumns = reorderColumn(
        column,
        hoveredColumn,
        columnOrder,
      );
      setColumnOrder(reorderedColumns);
      setColumnPinning(({ left = [], right = [] }) => ({
        left: reorderedColumns.filter((header) => left.includes(header)),
        right: reorderedColumns.filter((header) => right.includes(header)),
      }));
    }
  };

  const handleDragEnter = (_e: DragEvent) => {
    if (!isDragging && columnDef.enableColumnOrdering !== false) {
      setHoveredColumn(column);
    }
  };

  if (!columnDef.header || columnDef.visibleInShowHideMenu === false) {
    return null;
  }

  const itemStyle: React.CSSProperties = {
    paddingLeft: `${(column.depth + 0.5) * 2}rem`,
    opacity: isDragging ? 0.5 : 1,
    outline: isDragging
      ? '2px dashed var(--rdt-secondary-text-color)'
      : hoveredColumn?.id === column.id
        ? '2px dashed var(--rdt-primary-color)'
        : 'none',
    outlineOffset: '-2px',
  };

  return (
    <>
      <div
        ref={menuItemRef}
        className={styles.showHideColumnsMenuItem}
        style={itemStyle}
        onDragEnter={handleDragEnter}
        {...rest}
      >
        {/* Drag handle */}
        {columnDefType !== 'group' &&
          enableColumnOrdering &&
          !isNestedColumns &&
          (columnDef.enableColumnOrdering !== false ? (
            <button
              type="button"
              className={styles.showHideColumnsMenuItemDragHandle}
              draggable
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              aria-label={localization.move}
            >
              <DragHandleIcon />
            </button>
          ) : (
            <span style={{ width: '1.75rem' }} />
          ))}

        {/* Pin buttons */}
        {enableColumnPinning &&
          (column.getCanPin() ? (
            <div className={styles.showHideColumnsMenuItemPinButtons}>
              <button
                type="button"
                className={[
                  styles.showHideColumnsMenuPinButton,
                  column.getIsPinned() === 'left' &&
                    styles.showHideColumnsMenuPinButtonActive,
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() =>
                  column.pin(column.getIsPinned() === 'left' ? false : 'left')
                }
                disabled={!column.getCanPin()}
                aria-label={localization.pinToLeft}
                title={localization.pinToLeft}
              >
                <PushPinIcon style={{ transform: 'rotate(90deg)' }} />
              </button>
              <button
                type="button"
                className={[
                  styles.showHideColumnsMenuPinButton,
                  column.getIsPinned() === 'right' &&
                    styles.showHideColumnsMenuPinButtonActive,
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() =>
                  column.pin(column.getIsPinned() === 'right' ? false : 'right')
                }
                disabled={!column.getCanPin()}
                aria-label={localization.pinToRight}
                title={localization.pinToRight}
              >
                <PushPinIcon style={{ transform: 'rotate(-90deg)' }} />
              </button>
            </div>
          ) : (
            <span style={{ width: '4.25rem' }} />
          ))}

        {/* Visibility checkbox */}
        {enableHiding ? (
          <label className={styles.showHideColumnsMenuItem}>
            <input
              type="checkbox"
              className={styles.showHideColumnsMenuItemCheckbox}
              checked={switchChecked}
              onChange={() => handleToggleColumnHidden(column)}
              disabled={!column.getCanHide()}
              title={localization.toggleVisibility}
            />
            <span
              className={styles.showHideColumnsMenuItemLabel}
              style={{
                opacity: columnDefType !== 'display' ? 1 : 0.5,
              }}
            >
              {columnDef.header}
            </span>
          </label>
        ) : (
          <span className={styles.showHideColumnsMenuItemLabel}>
            {columnDef.header}
          </span>
        )}
      </div>

      {/* Nested columns */}
      {column.columns?.map((c: RDT_Column<TData>, i) => (
        <RDT_ShowHideColumnsMenuItems
          allColumns={allColumns}
          column={c}
          hoveredColumn={hoveredColumn}
          isNestedColumns={isNestedColumns}
          key={`${i}-${c.id}`}
          setHoveredColumn={setHoveredColumn}
          table={table}
        />
      ))}
    </>
  );
};
