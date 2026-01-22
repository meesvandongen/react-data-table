import { type ButtonHTMLAttributes, type MouseEvent } from 'react';
import { type RowPinningPosition } from '@tanstack/react-table';
import {
  type RDT_Row,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import styles from './buttons.module.css';

export interface RDT_RowPinButtonProps<TData extends RDT_RowData>
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  pinningPosition: RowPinningPosition;
  row: RDT_Row<TData>;
  table: RDT_TableInstance<TData>;
}

export const RDT_RowPinButton = <TData extends RDT_RowData>({
  pinningPosition,
  row,
  table,
  className,
  ...rest
}: RDT_RowPinButtonProps<TData>) => {
  const {
    options: {
      icons: { CloseIcon, PushPinIcon },
      localization,
      rowPinningDisplayMode,
    },
  } = table;

  const isPinned = row.getIsPinned();

  const handleTogglePin = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    row.pin(isPinned ? false : pinningPosition);
  };

  const label = isPinned ? localization.unpin : localization.pin;

  const iconStyle: React.CSSProperties = {
    transform: `rotate(${
      rowPinningDisplayMode === 'sticky'
        ? 135
        : pinningPosition === 'top'
          ? 180
          : 0
    }deg)`,
  };

  return (
    <button
      type="button"
      className={[styles.iconButton, styles.iconButtonSmall, className]
        .filter(Boolean)
        .join(' ')}
      aria-label={label}
      title={label}
      onClick={handleTogglePin}
      {...rest}
    >
      {isPinned ? <CloseIcon /> : <PushPinIcon style={iconStyle} />}
    </button>
  );
};
