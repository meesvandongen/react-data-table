import { type ButtonHTMLAttributes, type MouseEvent, useState } from 'react';
import {
  type RDT_Header,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import { RDT_ColumnActionMenu } from '../menus/RDT_ColumnActionMenu';
import styles from './buttons.module.css';

export interface RDT_ColumnActionMenuButtonProps<TData extends RDT_RowData>
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  header: RDT_Header<TData>;
  table: RDT_TableInstance<TData>;
}

export const RDT_ColumnActionMenuButton = <TData extends RDT_RowData>({
  header,
  table,
  className,
  ...rest
}: RDT_ColumnActionMenuButtonProps<TData>) => {
  const {
    options: {
      icons: { MoreVertIcon },
      localization,
    },
  } = table;

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const buttonClassName = [
    styles.iconButton,
    styles.columnActionButton,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <button
        type="button"
        aria-label={localization.columnActions}
        title={localization.columnActions}
        className={buttonClassName}
        onClick={handleOpenMenu}
        aria-haspopup="menu"
        aria-expanded={!!anchorEl}
        {...rest}
      >
        <MoreVertIcon />
      </button>
      <RDT_ColumnActionMenu
        anchorEl={anchorEl}
        header={header}
        setAnchorEl={setAnchorEl}
        table={table}
      />
    </>
  );
};
