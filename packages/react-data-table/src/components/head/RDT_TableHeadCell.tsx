import {
  type DragEvent,
  type ThHTMLAttributes,
  useCallback,
  useMemo,
} from 'react';
import clsx from 'clsx';
import {
  type RDT_ColumnVirtualizer,
  type RDT_Header,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import { getRDT_CellWidthStyles } from '../../utils/style.utils';
import { flexRender } from '../../utils/tanstack.helpers';
import { RDT_ColumnActionMenuButton } from '../buttons/RDT_ColumnActionMenuButton';
import { RDT_GrabHandleButton } from '../buttons/RDT_GrabHandleButton';
import { RDT_TableHeadCellFilterContainer } from './RDT_TableHeadCellFilterContainer';
import styles from '../table/table.module.css';

export interface RDT_TableHeadCellProps<TData extends RDT_RowData>
  extends ThHTMLAttributes<HTMLTableCellElement> {
  columnVirtualizer?: RDT_ColumnVirtualizer;
  header: RDT_Header<TData>;
  staticColumnIndex?: number;
  table: RDT_TableInstance<TData>;
}

export const RDT_TableHeadCell = <TData extends RDT_RowData>({
  columnVirtualizer,
  header,
  staticColumnIndex,
  table,
  className,
  style,
  ...rest
}: RDT_TableHeadCellProps<TData>) => {
  const {
    getState,
    options: {
      columnFilterDisplayMode,
      enableColumnActions,
      enableColumnDragging,
      enableColumnOrdering,
      enableColumnPinning,
      enableColumnResizing,
      enableGrouping,
      enableMultiSort,
      enableSorting,
      icons: { ArrowDownwardIcon, SortIcon },
      localization,
    },
    refs: { tableHeadCellRefs },
    setHoveredColumn,
  } = table;

  const {
    draggingColumn,
    grouping,
    hoveredColumn,
    isLoading,
    showSkeletons,
    sorting,
  } = getState();

  const { column } = header;
  const { columnDef } = column;
  const { columnDefType } = columnDef;

  const isPinned = column.getIsPinned();
  const isColumnSortable = enableSorting && column.getCanSort();
  const sortDirection = column.getIsSorted();

  const isColumnPinned =
    enableColumnPinning && columnDefType !== 'group' && column.getIsPinned();

  const showColumnActionButton =
    (enableColumnActions || columnDef.enableColumnActions) &&
    columnDef.enableColumnActions !== false;

  const showDragHandle =
    enableColumnDragging !== false &&
    columnDef.enableColumnDragging !== false &&
    (enableColumnDragging ||
      (enableColumnOrdering && columnDef.enableColumnOrdering !== false) ||
      (enableGrouping &&
        columnDef.enableGrouping !== false &&
        !grouping.includes(column.id)));

  const showFilterContainer =
    columnFilterDisplayMode === 'subheader' && column.getCanFilter();

  // Sort tooltip
  const sortTooltip =
    isLoading || showSkeletons
      ? ''
      : sortDirection
        ? sortDirection === 'desc'
          ? localization.sortedByColumnDesc.replace(
              '{column}',
              String(columnDef.header),
            )
          : localization.sortedByColumnAsc.replace(
              '{column}',
              String(columnDef.header),
            )
        : column.getNextSortingOrder() === 'desc'
          ? localization.sortByColumnDesc.replace(
              '{column}',
              String(columnDef.header),
            )
          : localization.sortByColumnAsc.replace(
              '{column}',
              String(columnDef.header),
            );

  const handleSort = () => {
    if (isColumnSortable && columnDefType !== 'group') {
      column.toggleSorting();
    }
  };

  const handleDragEnter = (_e: DragEvent) => {
    if (enableGrouping && hoveredColumn?.id === 'drop-zone') {
      setHoveredColumn(null);
    }
    if (enableColumnOrdering && draggingColumn && columnDefType !== 'group') {
      setHoveredColumn(
        columnDef.enableColumnOrdering !== false ? column : null,
      );
    }
  };

  const handleDragOver = (e: DragEvent) => {
    if (columnDef.enableColumnOrdering !== false) {
      e.preventDefault();
    }
  };

  const handleRef = useCallback(
    (node: HTMLTableCellElement) => {
      if (node) {
        if (tableHeadCellRefs.current) {
          tableHeadCellRefs.current[column.id] = node;
        }
        if (columnDefType !== 'group') {
          columnVirtualizer?.measureElement?.(node);
        }
      }
    },
    [column.id, columnDefType, columnVirtualizer, tableHeadCellRefs],
  );

  // Get the pinned position offset
  const pinnedOffset =
    isPinned === 'left'
      ? column.getStart('left')
      : isPinned === 'right'
        ? column.getAfter('right')
        : undefined;

  // Dragging borders styles
  const draggingBorders = useMemo(() => {
    if (draggingColumn?.id === column.id) {
      return styles.tableHeadCellDragging;
    }
    if (hoveredColumn?.id === column.id) {
      return styles.tableHeadCellDragTarget;
    }
    return undefined;
  }, [draggingColumn, hoveredColumn, column.id]);

  const HeaderElement = flexRender(
    columnDef.Header ?? (columnDef.header as any),
    {
      column,
      header,
      table,
    },
  );

  return (
    <th
      ref={handleRef}
      {...rest}
      colSpan={header.colSpan}
      data-index={staticColumnIndex}
      data-pinned={!!isColumnPinned || undefined}
      data-sort={sortDirection || undefined}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      className={clsx(
        styles.tableHeadCell,
        isPinned && styles.tableHeadCellPinned,
        isPinned === 'left' && styles.tableHeadCellPinnedLeft,
        isPinned === 'right' && styles.tableHeadCellPinnedRight,
        columnDefType === 'group' && styles.tableHeadCellGroup,
        draggingBorders,
        className,
      )}
      style={{
        ...getRDT_CellWidthStyles({ column, header, table }),
        maxWidth: columnDef.maxSize,
        ...(isPinned && {
          [isPinned === 'left'
            ? '--rdt-pinned-left-offset'
            : '--rdt-pinned-right-offset']: `${pinnedOffset}px`,
        }),
        ...(enableMultiSort && isColumnSortable && { userSelect: 'none' }),
        ...style,
      }}
      aria-sort={
        sortDirection
          ? sortDirection === 'asc'
            ? 'ascending'
            : 'descending'
          : undefined
      }
    >
      {header.isPlaceholder ? null : (
        <>
          {/* Main header content row */}
          <div className={styles.tableHeadCellContent}>
            {/* Labels section (sortable) */}
            <div
              className={clsx(
                styles.tableHeadCellLabels,
                isColumnSortable &&
                  columnDefType !== 'group' &&
                  styles.tableHeadCellLabelsSortable,
              )}
              onClick={handleSort}
              title={sortTooltip}
            >
              {/* Header text */}
              <span className={styles.tableHeadCellLabel}>{HeaderElement}</span>

              {/* Sort indicator */}
              {isColumnSortable && (
                <span
                  className={clsx(
                    styles.sortIcon,
                    sortDirection && styles.sortIconActive,
                  )}
                  aria-label={sortTooltip}
                >
                  {sortDirection ? (
                    sortDirection === 'asc' ? (
                      <ArrowDownwardIcon
                        style={{ transform: 'rotate(180deg)' }}
                      />
                    ) : (
                      <ArrowDownwardIcon />
                    )
                  ) : (
                    <SortIcon />
                  )}
                  {/* Multi-sort index badge */}
                  {sorting.length > 1 && sortDirection && (
                    <span className={styles.sortBadge}>
                      {column.getSortIndex() + 1}
                    </span>
                  )}
                </span>
              )}
            </div>

            {/* Actions section */}
            {columnDefType !== 'group' && (
              <div className={styles.tableHeadCellActions}>
                {showDragHandle && (
                  <RDT_GrabHandleButton
                    table={table}
                    onDragStart={() => {
                      table.setDraggingColumn(column);
                    }}
                    onDragEnd={() => {
                      table.setDraggingColumn(null);
                      table.setHoveredColumn(null);
                    }}
                  />
                )}
                {showColumnActionButton && (
                  <RDT_ColumnActionMenuButton header={header} table={table} />
                )}
              </div>
            )}

            {/* Resize handle */}
            {enableColumnResizing && column.getCanResize() && (
              <div
                className={clsx(
                  styles.resizeHandle,
                  column.getIsResizing() && styles.resizeHandleActive,
                )}
                onMouseDown={header.getResizeHandler()}
                onTouchStart={header.getResizeHandler()}
                onDoubleClick={() => column.resetSize()}
              />
            )}
          </div>

          {/* Filter container */}
          {showFilterContainer && (
            <RDT_TableHeadCellFilterContainer header={header} table={table} />
          )}
        </>
      )}
    </th>
  );
};
