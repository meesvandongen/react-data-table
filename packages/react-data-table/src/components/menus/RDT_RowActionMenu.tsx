import { type MouseEvent, type ReactNode, useMemo } from 'react';
import { Menu, MenuItem, MenuTrigger, Popover } from 'react-aria-components';
import clsx from 'clsx';
import {
  type RDT_Row,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import styles from './menus.module.css';

export interface RDT_RowActionMenuProps<TData extends RDT_RowData> {
  anchorEl: HTMLElement | null;
  handleEdit: (event: MouseEvent) => void;
  row: RDT_Row<TData>;
  setAnchorEl: (anchorEl: HTMLElement | null) => void;
  staticRowIndex?: number;
  table: RDT_TableInstance<TData>;
}

export const RDT_RowActionMenu = <TData extends RDT_RowData>({
  anchorEl,
  handleEdit,
  row,
  setAnchorEl,
  staticRowIndex,
  table,
}: RDT_RowActionMenuProps<TData>) => {
  const {
    getState,
    options: {
      editDisplayMode,
      enableEditing,
      icons: { EditIcon },
      localization,
      renderRowActionMenuItems,
    },
  } = table;

  const { density } = getState();
  const isDense = density === 'compact';

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = useMemo(() => {
    const items: Array<{
      key: string;
      icon: ReactNode;
      label: string;
      onClick: () => void;
    }> = [];
    const canEdit =
      parseFromValuesOrFunc(enableEditing, row) &&
      ['modal', 'row'].includes(editDisplayMode!);

    if (canEdit) {
      items.push({
        key: 'edit',
        icon: <EditIcon />,
        label: localization.edit ?? 'Edit',
        onClick: () => {
          handleEdit({} as MouseEvent);
          handleClose();
        },
      });
    }

    const customItems = renderRowActionMenuItems?.({
      closeMenu: handleClose,
      row,
      staticRowIndex,
      table,
    });

    // Handle custom items (they could be JSX elements from the user)
    if (customItems?.length) {
      return { internalItems: items, customItems };
    }

    return { internalItems: items, customItems: null };
  }, [
    editDisplayMode,
    enableEditing,
    handleEdit,
    localization.edit,
    renderRowActionMenuItems,
    row,
    staticRowIndex,
    table,
  ]);

  if (
    (!menuItems.internalItems.length && !menuItems.customItems?.length) ||
    !anchorEl
  ) {
    return null;
  }

  return (
    <MenuTrigger isOpen={!!anchorEl} onOpenChange={() => {}}>
      {/* Hidden trigger */}
      <button style={{ display: 'none' }} aria-hidden>
        trigger
      </button>
      <Popover
        isOpen={!!anchorEl}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleClose();
        }}
        triggerRef={{ current: anchorEl }}
        placement="bottom start"
        className={clsx(styles.menu, styles.rowActionMenu)}
      >
        <Menu
          onAction={() => {}}
          aria-label={localization.rowActions ?? 'Row actions'}
          className={styles.menuInner}
        >
          {menuItems.customItems ? (
            <>{menuItems.customItems}</>
          ) : (
            <>
              {menuItems.internalItems.map((item) => (
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
