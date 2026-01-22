import { type HTMLAttributes } from 'react';
import { type RDT_RowData, type RDT_TableInstance } from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { RDT_LinearProgressBar } from './RDT_LinearProgressBar';
import { RDT_TablePagination } from './RDT_TablePagination';
import { RDT_ToolbarAlertBanner } from './RDT_ToolbarAlertBanner';
import { RDT_ToolbarDropZone } from './RDT_ToolbarDropZone';
import styles from './toolbar.module.css';

export interface RDT_BottomToolbarProps<TData extends RDT_RowData>
  extends HTMLAttributes<HTMLDivElement> {
  table: RDT_TableInstance<TData>;
}

export const RDT_BottomToolbar = <TData extends RDT_RowData>({
  table,
  ...rest
}: RDT_BottomToolbarProps<TData>) => {
  const {
    getState,
    options: {
      enablePagination,
      positionPagination,
      positionToolbarAlertBanner,
      positionToolbarDropZone,
      renderBottomToolbar,
      renderBottomToolbarCustomActions,
    },
    refs: { bottomToolbarRef },
  } = table;

  const { isFullScreen } = getState();

  // Check if we need to stack the alert banner
  const stackAlertBanner = !!renderBottomToolbarCustomActions;

  // Allow complete custom toolbar
  if (renderBottomToolbar) {
    const customToolbar = parseFromValuesOrFunc(renderBottomToolbar, { table });
    if (customToolbar) {
      return <>{customToolbar}</>;
    }
  }

  const toolbarClassName = [
    styles.toolbar,
    styles.toolbarBottom,
    isFullScreen && styles.toolbarFullScreenBottom,
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
    <div ref={bottomToolbarRef} className={toolbarClassName} {...rest}>
      <RDT_LinearProgressBar isTopToolbar={false} table={table} />
      {positionToolbarAlertBanner === 'bottom' && (
        <RDT_ToolbarAlertBanner
          stackAlertBanner={stackAlertBanner}
          table={table}
        />
      )}
      {['both', 'bottom'].includes(positionToolbarDropZone ?? '') && (
        <RDT_ToolbarDropZone table={table} />
      )}
      <div className={contentClassName}>
        {/* Left side - custom actions */}
        {renderBottomToolbarCustomActions ? (
          renderBottomToolbarCustomActions({ table })
        ) : (
          <span />
        )}

        {/* Right side - pagination */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {enablePagination &&
            ['both', 'bottom'].includes(positionPagination ?? '') && (
              <RDT_TablePagination position="bottom" table={table} />
            )}
        </div>
      </div>
    </div>
  );
};
