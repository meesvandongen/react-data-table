import { type HTMLAttributes } from 'react';
import { type RDT_RowData, type RDT_TableInstance } from '../../types';
import { RDT_ShowHideColumnsButton } from '../buttons/RDT_ShowHideColumnsButton';
import { RDT_ToggleDensePaddingButton } from '../buttons/RDT_ToggleDensePaddingButton';
import { RDT_ToggleFiltersButton } from '../buttons/RDT_ToggleFiltersButton';
import { RDT_ToggleFullScreenButton } from '../buttons/RDT_ToggleFullScreenButton';
import { RDT_ToggleGlobalFilterButton } from '../buttons/RDT_ToggleGlobalFilterButton';
import styles from '../buttons/buttons.module.css';

export interface RDT_ToolbarInternalButtonsProps<TData extends RDT_RowData>
  extends HTMLAttributes<HTMLDivElement> {
  table: RDT_TableInstance<TData>;
}

export const RDT_ToolbarInternalButtons = <TData extends RDT_RowData>({
  table,
  ...rest
}: RDT_ToolbarInternalButtonsProps<TData>) => {
  const {
    options: {
      columnFilterDisplayMode,
      enableColumnFilters,
      enableColumnOrdering,
      enableColumnPinning,
      enableDensityToggle,
      enableFilters,
      enableFullScreenToggle,
      enableGlobalFilter,
      enableHiding,
      initialState,
      renderToolbarInternalActions,
    },
  } = table;

  // Allow custom render function to override
  if (renderToolbarInternalActions) {
    return (
      <div className={styles.toolbarInternalButtons} {...rest}>
        {renderToolbarInternalActions({ table })}
      </div>
    );
  }

  return (
    <div className={styles.toolbarInternalButtons} {...rest}>
      {enableFilters &&
        enableGlobalFilter &&
        !initialState?.showGlobalFilter && (
          <RDT_ToggleGlobalFilterButton table={table} />
        )}
      {enableFilters &&
        enableColumnFilters &&
        columnFilterDisplayMode !== 'popover' && (
          <RDT_ToggleFiltersButton table={table} />
        )}
      {(enableHiding || enableColumnOrdering || enableColumnPinning) && (
        <RDT_ShowHideColumnsButton table={table} />
      )}
      {enableDensityToggle && <RDT_ToggleDensePaddingButton table={table} />}
      {enableFullScreenToggle && <RDT_ToggleFullScreenButton table={table} />}
    </div>
  );
};
