import {
  type ReactNode,
  useMemo,
  type MouseEvent,
  type HTMLAttributes,
} from 'react';
import clsx from 'clsx';
import { RDT_ActionMenuItem } from './RDT_ActionMenuItem';
import {
  type RDT_Row,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import styles from './menus.module.css';

export interface RDT_RowActionMenuProps<TData extends RDT_RowData>
  extends HTMLAttributes<HTMLDivElement> {
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
  className,
  style,
  ...rest
}: RDT_RowActionMenuProps<TData>) => {
  const {
    options: {
      editDisplayMode,
      enableEditing,
      icons: { EditIcon },
      localization,
      renderRowActionMenuItems,
    },
  } = table;

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = useMemo(() => {
    const items: ReactNode[] = [];
    const canEdit =
      parseFromValuesOrFunc(enableEditing, row) &&
      ['modal', 'row'].includes(editDisplayMode!);

    if (canEdit) {
      items.push(
        <RDT_ActionMenuItem
          key="edit"
          icon={<EditIcon />}
          label={localization.edit ?? 'Edit'}
          onClick={(event) => {
            handleEdit(event as any);
            handleClose();
          }}
          table={table}
        />,
      );
    }

    const customItems = renderRowActionMenuItems?.({
      closeMenu: handleClose,
      row,
      staticRowIndex,
      table,
    });

    if (customItems?.length) {
      items.push(...customItems);
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

  // Calculate position based on anchor element
  const rect = anchorEl.getBoundingClientRect();

  return (
    <>
      {/* Backdrop to close menu when clicking outside */}
      <div className={styles.menuBackdrop} onClick={handleClose} />
      <div
        role="menu"
        onClick={(event) => event.stopPropagation()}
        {...rest}
        className={clsx(styles.menu, styles.rowActionMenu, className)}
        style={{
          position: 'fixed',
          top: rect.bottom + 4,
          left: rect.left,
          ...style,
        }}
      >
        {menuItems}
      </div>
    </>
  );
};
