import {
  type CSSProperties,
  type HTMLAttributes,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import clsx from 'clsx';
import { type RDT_RowData, type RDT_TableInstance } from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { RDT_CellActionMenu } from '../menus/RDT_CellActionMenu';
import { RDT_EditRowModal } from '../modals/RDT_EditRowModal';
import { RDT_Table } from './RDT_Table';
import { RDT_TableLoadingOverlay } from './RDT_TableLoadingOverlay';
import styles from './table.module.css';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export interface RDT_TableContainerProps<TData extends RDT_RowData>
  extends HTMLAttributes<HTMLDivElement> {
  table: RDT_TableInstance<TData>;
}

export const RDT_TableContainer = <TData extends RDT_RowData>({
  table,
  className,
  style,
  ...rest
}: RDT_TableContainerProps<TData>) => {
  const {
    getState,
    options: {
      columnResizeDirection,
      createDisplayMode,
      editDisplayMode,
      enableCellActions,
      enableStickyHeader,
      tableContainerProps,
    },
    refs: { bottomToolbarRef, tableContainerRef, topToolbarRef },
  } = table;
  const {
    creatingRow,
    draggingColumn,
    draggingRow,
    editingRow,
    isFullScreen,
    isLoading,
    showLoadingOverlay,
  } = getState();

  const isDragging = !!(draggingColumn || draggingRow);

  const loading =
    showLoadingOverlay !== false && (isLoading || showLoadingOverlay);

  const [totalToolbarHeight, setTotalToolbarHeight] = useState(0);

  const containerProps = {
    ...parseFromValuesOrFunc(tableContainerProps, { table }),
    ...rest,
  };

  useIsomorphicLayoutEffect(() => {
    const topToolbarHeight =
      typeof document !== 'undefined'
        ? (topToolbarRef.current?.offsetHeight ?? 0)
        : 0;

    const bottomToolbarHeight =
      typeof document !== 'undefined'
        ? (bottomToolbarRef?.current?.offsetHeight ?? 0)
        : 0;

    setTotalToolbarHeight(topToolbarHeight + bottomToolbarHeight);
  });

  const createModalOpen = createDisplayMode === 'modal' && creatingRow;
  const editModalOpen = editDisplayMode === 'modal' && editingRow;

  return (
    <div
      aria-busy={loading}
      aria-describedby={loading ? 'rdt-progress' : undefined}
      {...containerProps}
      ref={(node) => {
        if (node) {
          tableContainerRef.current = node;
          if (typeof containerProps?.ref === 'function') {
            containerProps.ref(node);
          } else if (containerProps?.ref) {
            (
              containerProps.ref as React.MutableRefObject<HTMLDivElement | null>
            ).current = node;
          }
        }
      }}
      className={clsx(
        styles.tableContainer,
        (enableStickyHeader || isFullScreen) && styles.tableContainerSticky,
        isDragging && styles.tableContainerDragging,
        containerProps?.className,
        className,
      )}
      data-column-resize-direction={columnResizeDirection}
      style={
        {
          '--rdt-toolbar-height': `${totalToolbarHeight}px`,
          maxHeight: isFullScreen
            ? `calc(100vh - ${totalToolbarHeight}px)`
            : undefined,
          ...containerProps?.style,
          ...style,
        } as CSSProperties
      }
    >
      {loading ? <RDT_TableLoadingOverlay table={table} /> : null}
      <RDT_Table table={table} />
      <RDT_EditRowModal
        open={!!(createModalOpen || editModalOpen)}
        table={table}
      />
      {enableCellActions && <RDT_CellActionMenu table={table} />}
    </div>
  );
};
