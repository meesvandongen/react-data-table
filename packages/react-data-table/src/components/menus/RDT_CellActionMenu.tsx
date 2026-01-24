import { type ReactNode } from 'react';
import { Menu, MenuItem, MenuTrigger, Popover } from 'react-aria-components';
import clsx from 'clsx';
import { type RDT_RowData, type RDT_TableInstance } from '../../types';
import { openEditingCell } from '../../utils/cell.utils';
import { parseFromValuesOrFunc } from '../../utils/utils';
import styles from './menus.module.css';

export interface RDT_CellActionMenuProps<TData extends RDT_RowData> {
  className?: string;
  table: RDT_TableInstance<TData>;
}

export const RDT_CellActionMenu = <TData extends RDT_RowData>({
  table,
  className,
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
  const { actionCell, density } = getState();

  if (!actionCell) {
    return null;
  }

  const cell = actionCell;
  const { row, column } = cell;
  const { columnDef } = column;
  const isDense = density === 'compact';

  const handleClose = (event?: React.MouseEvent) => {
    event?.stopPropagation();
    table.setActionCell(null);
    if (actionCellRef?.current) {
      actionCellRef.current = null;
    }
  };

  const internalMenuItems: Array<{
    key: string;
    icon: ReactNode;
    label: string;
    onClick: () => void;
  }> = [];

  // Copy action for context menu
  const showCopy =
    parseFromValuesOrFunc(enableClickToCopy, cell) === 'context-menu' ||
    parseFromValuesOrFunc(columnDef.enableClickToCopy, cell) === 'context-menu';

  if (showCopy) {
    internalMenuItems.push({
      key: 'rdt-copy',
      icon: <ContentCopyIcon />,
      label: localization.copy ?? 'Copy',
      onClick: () => {
        navigator.clipboard.writeText(cell.getValue() as string);
        handleClose();
      },
    });
  }

  // Edit action
  const showEdit =
    parseFromValuesOrFunc(enableEditing, row) && editDisplayMode === 'cell';

  if (showEdit) {
    internalMenuItems.push({
      key: 'rdt-edit',
      icon: <EditIcon />,
      label: localization.edit ?? 'Edit',
      onClick: () => {
        openEditingCell({ cell, table });
        handleClose();
      },
    });
  }

  const renderActionProps = {
    cell,
    closeMenu: handleClose,
    column,
    internalMenuItems: internalMenuItems.map((item) => (
      <MenuItem
        key={item.key}
        className={clsx(styles.menuItem, isDense && styles.menuItemDense)}
        onAction={item.onClick}
      >
        <span className={styles.menuItemContent}>
          <span className={styles.menuItemIcon}>{item.icon}</span>
          <span className={styles.menuItemLabel}>{item.label}</span>
        </span>
      </MenuItem>
    )),
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

  // Get position from action cell ref
  const anchorEl = actionCellRef?.current;

  if (!anchorEl) {
    return null;
  }

  return (
    <MenuTrigger isOpen={!!actionCell} onOpenChange={() => {}}>
      {/* Hidden trigger */}
      <button style={{ display: 'none' }} aria-hidden>
        trigger
      </button>
      <Popover
        isOpen={!!actionCell}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleClose();
        }}
        triggerRef={{ current: anchorEl }}
        placement="bottom end"
        className={clsx(styles.menu, styles.cellActionMenu, className)}
      >
        <Menu
          onAction={() => {}}
          aria-label={localization.cellActions}
          className={styles.menuInner}
        >
          {customMenuItems ? (
            <>{customMenuItems}</>
          ) : (
            <>
              {internalMenuItems.map((item) => (
                <MenuItem
                  key={item.key}
                  className={clsx(
                    styles.menuItem,
                    isDense && styles.menuItemDense,
                  )}
                  onAction={item.onClick}
                >
                  <span className={styles.menuItemContent}>
                    <span className={styles.menuItemIcon}>{item.icon}</span>
                    <span className={styles.menuItemLabel}>{item.label}</span>
                  </span>
                </MenuItem>
              ))}
            </>
          )}
        </Menu>
      </Popover>
    </MenuTrigger>
  );
};
