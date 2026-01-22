import { type HTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';
import { RDT_ActionMenuItem } from './RDT_ActionMenuItem';
import { type RDT_RowData, type RDT_TableInstance } from '../../types';
import { openEditingCell } from '../../utils/cell.utils';
import { parseFromValuesOrFunc } from '../../utils/utils';
import styles from './menus.module.css';

export interface RDT_CellActionMenuProps<TData extends RDT_RowData>
  extends HTMLAttributes<HTMLDivElement> {
  table: RDT_TableInstance<TData>;
}

export const RDT_CellActionMenu = <TData extends RDT_RowData>({
  table,
  className,
  style,
  ...rest
}: RDT_CellActionMenuProps<TData>) => {
  const {
    getState,
    options: {
      editDisplayMode,
      enableClickToCopy,
      enableEditing,
      icons: { ContentCopyIcon, EditIcon },
      localization,
      renderCellActionMenuItems,
    },
    refs: { actionCellRef },
  } = table;
  const { actionCell } = getState();

  if (!actionCell) {
    return null;
  }

  const cell = actionCell;
  const { row, column } = cell;
  const { columnDef } = column;

  const handleClose = (event?: React.MouseEvent) => {
    event?.stopPropagation();
    table.setActionCell(null);
    if (actionCellRef?.current) {
      actionCellRef.current = null;
    }
  };

  const internalMenuItems: ReactNode[] = [];

  // Copy action for context menu
  const showCopy =
    parseFromValuesOrFunc(enableClickToCopy, cell) === 'context-menu' ||
    parseFromValuesOrFunc(columnDef.enableClickToCopy, cell) === 'context-menu';

  if (showCopy) {
    internalMenuItems.push(
      <RDT_ActionMenuItem
        icon={<ContentCopyIcon />}
        key="rdt-copy"
        label={localization.copy ?? 'Copy'}
        onClick={(event) => {
          event.stopPropagation();
          navigator.clipboard.writeText(cell.getValue() as string);
          handleClose();
        }}
        table={table}
      />,
    );
  }

  // Edit action
  const showEdit =
    parseFromValuesOrFunc(enableEditing, row) && editDisplayMode === 'cell';

  if (showEdit) {
    internalMenuItems.push(
      <RDT_ActionMenuItem
        icon={<EditIcon />}
        key="rdt-edit"
        label={localization.edit ?? 'Edit'}
        onClick={() => {
          openEditingCell({ cell, table });
          handleClose();
        }}
        table={table}
      />,
    );
  }

  const renderActionProps = {
    cell,
    closeMenu: handleClose,
    column,
    internalMenuItems,
    row,
    table,
  };

  const customMenuItems =
    columnDef.renderCellActionMenuItems?.(renderActionProps) ??
    renderCellActionMenuItems?.(renderActionProps);

  const menuItems = customMenuItems ?? internalMenuItems;

  if (!menuItems?.length) {
    return null;
  }

  // Calculate position based on action cell ref
  const anchorEl = actionCellRef?.current;
  const rect = anchorEl?.getBoundingClientRect();

  if (!rect) {
    return null;
  }

  return (
    <>
      {/* Backdrop to close menu when clicking outside */}
      <div className={styles.menuBackdrop} onClick={handleClose} />
      <div
        role="menu"
        onClick={(event) => event.stopPropagation()}
        {...rest}
        className={clsx(styles.menu, styles.cellActionMenu, className)}
        style={{
          position: 'fixed',
          top: rect.bottom + 4,
          left: rect.right - 100,
          ...style,
        }}
      >
        {menuItems}
      </div>
    </>
  );
};
