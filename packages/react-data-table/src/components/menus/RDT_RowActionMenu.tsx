import { type MouseEvent, useMemo } from 'react';
import { Menu, MenuItem, MenuTrigger, Popover } from 'react-aria-components';
import clsx from 'clsx';
import {
  type RDT_Row,
  type RDT_RowActionMenuItem,
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

  const menuItems = useMemo((): RDT_RowActionMenuItem[] => {
    const items: RDT_RowActionMenuItem[] = [];

    // Add edit item if editing is enabled
    const canEdit =
      parseFromValuesOrFunc(enableEditing, row) &&
      ['modal', 'row'].includes(editDisplayMode ?? '');

    if (canEdit) {
      items.push({
        icon: <EditIcon />,
        label: localization.edit ?? 'Edit',
        onClick: () => {
          handleEdit({} as MouseEvent);
          handleClose();
        },
      });
    }

    // Add custom items from renderRowActionMenuItems
    const customItems = renderRowActionMenuItems?.({
      row,
      staticRowIndex,
      table,
    });

    if (customItems?.length) {
      // Wrap custom onClick to auto-close menu
      items.push(
        ...customItems.map((item) => ({
          ...item,
          onClick: () => {
            item.onClick();
            handleClose();
          },
        })),
      );
    }

    return items;
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

  if (!menuItems.length || !anchorEl) {
    return null;
  }

  return (
    <MenuTrigger isOpen={!!anchorEl} onOpenChange={() => {}}>
      {/* Hidden trigger - we control open state externally */}
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
          {menuItems.map((item, index) => (
            <MenuItem
              key={item.label + index}
              className={clsx(
                styles.menuItem,
                isDense && styles.menuItemDense,
                item.divider && styles.menuItemDivider,
              )}
              isDisabled={item.disabled}
              onAction={item.onClick}
            >
              <span className={styles.menuItemContent}>
                {item.icon && (
                  <span className={styles.menuItemIcon}>{item.icon}</span>
                )}
                <span className={styles.menuItemLabel}>{item.label}</span>
              </span>
            </MenuItem>
          ))}
        </Menu>
      </Popover>
    </MenuTrigger>
  );
};
