import { type ButtonHTMLAttributes, type MouseEvent, useState } from 'react';
import clsx from 'clsx';
import { RDT_EditActionButtons } from './RDT_EditActionButtons';
import {
  type RDT_Cell,
  type RDT_Row,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { RDT_RowActionMenu } from '../menus/RDT_RowActionMenu';
import styles from './buttons.module.css';

export interface RDT_ToggleRowActionMenuButtonProps<TData extends RDT_RowData>
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  cell: RDT_Cell<TData>;
  row: RDT_Row<TData>;
  staticRowIndex?: number;
  table: RDT_TableInstance<TData>;
}

export const RDT_ToggleRowActionMenuButton = <TData extends RDT_RowData>({
  cell,
  row,
  staticRowIndex,
  table,
  className,
  ...rest
}: RDT_ToggleRowActionMenuButtonProps<TData>) => {
  const {
    getState,
    options: {
      createDisplayMode,
      editDisplayMode,
      enableEditing,
      icons,
      localization,
      renderRowActionMenuItems,
      renderRowActions,
    },
    setEditingRow,
  } = table;

  const { EditIcon, MoreHorizIcon } = icons;

  const { creatingRow, editingRow } = getState();

  const isCreating = creatingRow?.id === row.id;
  const isEditing = editingRow?.id === row.id;

  const showEditActionButtons =
    (isCreating && createDisplayMode === 'row') ||
    (isEditing && editDisplayMode === 'row');

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpenRowActionMenu = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleStartEditMode = (event: MouseEvent) => {
    event.stopPropagation();
    setEditingRow({ ...row });
    setAnchorEl(null);
  };

  // 1. If renderRowActions is provided and we're not in edit mode, use it
  if (renderRowActions && !showEditActionButtons) {
    return <>{renderRowActions({ cell, row, staticRowIndex, table })}</>;
  }

  // 2. Show edit action buttons (Save/Cancel) when in row edit/create mode
  if (showEditActionButtons) {
    return <RDT_EditActionButtons row={row} table={table} />;
  }

  // 3. Show simple Edit button if only editing is enabled (no menu items)
  if (
    !renderRowActionMenuItems &&
    parseFromValuesOrFunc(enableEditing, row) &&
    ['modal', 'row'].includes(editDisplayMode ?? '')
  ) {
    return (
      <button
        type="button"
        aria-label={localization.edit}
        title={localization.edit}
        onClick={handleStartEditMode}
        className={clsx(styles.rowActionButton, className)}
        {...rest}
      >
        <EditIcon />
      </button>
    );
  }

  // 4. Show menu toggle button when renderRowActionMenuItems is provided
  if (!renderRowActionMenuItems) {
    return null;
  }

  const menuItems = renderRowActionMenuItems({
    row,
    staticRowIndex,
    table,
  });

  if (!menuItems?.length) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        aria-label={localization.rowActions}
        title={localization.rowActions}
        onClick={handleOpenRowActionMenu}
        className={clsx(styles.rowActionButton, className)}
        {...rest}
      >
        <MoreHorizIcon />
      </button>
      <RDT_RowActionMenu
        anchorEl={anchorEl}
        handleEdit={handleStartEditMode}
        row={row}
        setAnchorEl={setAnchorEl}
        staticRowIndex={staticRowIndex}
        table={table}
      />
    </>
  );
};
