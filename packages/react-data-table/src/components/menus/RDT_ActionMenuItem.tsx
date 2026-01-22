import {
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { type RDT_RowData, type RDT_TableInstance } from '../../types';
import styles from './menus.module.css';

export interface RDT_ActionMenuItemProps<TData extends RDT_RowData>
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  divider?: boolean;
  icon?: ReactNode;
  label: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  onOpenSubMenu?: (event: MouseEvent<HTMLButtonElement>) => void;
  table: RDT_TableInstance<TData>;
}

export const RDT_ActionMenuItem = <TData extends RDT_RowData>({
  divider,
  icon,
  label,
  onClick,
  onOpenSubMenu,
  table,
  className,
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

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
  };

  const handleSubMenuClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onOpenSubMenu?.(event);
  };

  const itemClassName = [
    styles.menuItem,
    isDense && styles.menuItemDense,
    divider && styles.menuItemDivider,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={itemClassName}
      onClick={handleClick}
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
    </button>
  );
};
