import { type HTMLAttributes } from 'react';
import { type RDT_RowData, type RDT_TableInstance } from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { RDT_GlobalFilterTextField } from '../inputs/RDT_GlobalFilterTextField';
import { RDT_LinearProgressBar } from './RDT_LinearProgressBar';
import { RDT_TablePagination } from './RDT_TablePagination';
import { RDT_ToolbarAlertBanner } from './RDT_ToolbarAlertBanner';
import { RDT_ToolbarDropZone } from './RDT_ToolbarDropZone';
import { RDT_ToolbarInternalButtons } from './RDT_ToolbarInternalButtons';
import styles from './toolbar.module.css';

export interface RDT_TopToolbarProps<TData extends RDT_RowData>
  extends HTMLAttributes<HTMLDivElement> {
  table: RDT_TableInstance<TData>;
}

export const RDT_TopToolbar = <TData extends RDT_RowData>({
  table,
  ...rest
}: RDT_TopToolbarProps<TData>) => {
  const {
    getState,
    options: {
      enableGlobalFilter,
      enablePagination,
      enableToolbarInternalActions,
      positionGlobalFilter,
      positionPagination,
      positionToolbarAlertBanner,
      positionToolbarDropZone,
      renderTopToolbar,
      renderTopToolbarCustomActions,
    },
    refs: { topToolbarRef },
  } = table;

  const { isFullScreen, showGlobalFilter } = getState();

  // Check if we need to stack the alert banner
  // In the original MRT, this was based on media queries
  // For simplicity, we'll base it on whether there are custom actions or global filter is visible
  const stackAlertBanner = !!renderTopToolbarCustomActions || showGlobalFilter;

  // Allow complete custom toolbar
  if (renderTopToolbar) {
    const customToolbar = parseFromValuesOrFunc(renderTopToolbar, { table });
    if (customToolbar) {
      return <>{customToolbar}</>;
    }
  }

  const toolbarClassName = [
    styles.toolbar,
    styles.toolbarTop,
    isFullScreen && styles.toolbarFullScreen,
  ]
    .filter(Boolean)
    .join(' ');

  const contentClassName = [
    styles.toolbarContent,
    stackAlertBanner
      ? styles.toolbarContentStacked
      : styles.toolbarContentAbsolute,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={topToolbarRef} className={toolbarClassName} {...rest}>
      {positionToolbarAlertBanner === 'top' && (
        <RDT_ToolbarAlertBanner
          stackAlertBanner={stackAlertBanner}
          table={table}
        />
      )}
      {['both', 'top'].includes(positionToolbarDropZone ?? '') && (
        <RDT_ToolbarDropZone table={table} />
      )}
      <div className={contentClassName}>
        {/* Left side - global filter (if left) or custom actions */}
        {enableGlobalFilter && positionGlobalFilter === 'left' ? (
          <RDT_GlobalFilterTextField table={table} />
        ) : (
          (renderTopToolbarCustomActions?.({ table }) ?? <span />)
        )}

        {/* Right side - internal actions with optional global filter */}
        {enableToolbarInternalActions ? (
          <div className={styles.toolbarActions}>
            {enableGlobalFilter && positionGlobalFilter === 'right' && (
              <RDT_GlobalFilterTextField table={table} />
            )}
            <RDT_ToolbarInternalButtons table={table} />
          </div>
        ) : (
          enableGlobalFilter &&
          positionGlobalFilter === 'right' && (
            <RDT_GlobalFilterTextField table={table} />
          )
        )}
      </div>
      {enablePagination &&
        ['both', 'top'].includes(positionPagination ?? '') && (
          <RDT_TablePagination position="top" table={table} />
        )}
      <RDT_LinearProgressBar isTopToolbar table={table} />
    </div>
  );
};
