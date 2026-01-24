import { type MouseEvent, type ReactNode } from 'react';
import { MenuItem } from 'react-aria-components';
import { type RDT_RowData, type RDT_TableInstance } from '../../types';
import styles from './menus.module.css';

export interface RDT_ActionMenuItemProps<TData extends RDT_RowData> {
  divider?: boolean;
  icon?: ReactNode;
  label: string;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  onOpenSubMenu?: (event: MouseEvent<HTMLButtonElement>) => void;
  table: RDT_TableInstance<TData>;
  disabled?: boolean;
  'aria-selected'?: boolean;
}

export const RDT_ActionMenuItem = <TData extends RDT_RowData>({
  divider,
  icon,
  label,
  onClick,
  onOpenSubMenu,
  table,
  disabled,
  ...rest
}: RDT_ActionMenuItemProps<TData>) => {
  const {
    getState,
    options: {
      icons: { ArrowRightIcon },
    },
  } = table;

  const { density } = getState();
  const isDense = density === 'compact';

  const handleSubMenuClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onOpenSubMenu?.(event);
  };

  const itemClassName = [
    styles.menuItem,
    isDense && styles.menuItemDense,
    divider && styles.menuItemDivider,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <MenuItem
      className={itemClassName}
      onAction={() => onClick?.({} as MouseEvent<HTMLDivElement>)}
      isDisabled={disabled}
      {...rest}
    >
      <span className={styles.menuItemContent}>
        {icon && <span className={styles.menuItemIcon}>{icon}</span>}
        <span className={styles.menuItemLabel}>{label}</span>
      </span>
      {onOpenSubMenu && (
        <button
          type="button"
          className={styles.menuItemSubMenuIcon}
          onClick={handleSubMenuClick}
          onMouseEnter={handleSubMenuClick}
          aria-label="Open submenu"
        >
          <ArrowRightIcon />
        </button>
      )}
    </MenuItem>
  );
};
