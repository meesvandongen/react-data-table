import { type HTMLAttributes, useState, useRef } from 'react';
import { type RDT_RowData, type RDT_TableInstance } from '../../types';
import { RDT_ShowHideColumnsMenu } from '../menus/RDT_ShowHideColumnsMenu';
import styles from './buttons.module.css';

export interface RDT_ShowHideColumnsButtonProps<TData extends RDT_RowData>
  extends HTMLAttributes<HTMLButtonElement> {
  table: RDT_TableInstance<TData>;
}

export const RDT_ShowHideColumnsButton = <TData extends RDT_RowData>({
  table,
  title,
  ...rest
}: RDT_ShowHideColumnsButtonProps<TData>) => {
  const {
    options: {
      icons: { ViewColumnIcon },
      localization,
    },
  } = table;

  const buttonRef = useRef<HTMLButtonElement>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = () => {
    setAnchorEl(buttonRef.current);
  };

  const label = title ?? localization.showHideColumns;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={styles.iconButton}
        aria-label={label}
        title={label}
        onClick={handleClick}
        aria-haspopup="menu"
        aria-expanded={!!anchorEl}
        {...rest}
      >
        <ViewColumnIcon />
      </button>
      <RDT_ShowHideColumnsMenu
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        table={table}
      />
    </>
  );
};
