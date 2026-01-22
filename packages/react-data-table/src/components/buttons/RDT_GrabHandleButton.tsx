import { type ButtonHTMLAttributes, type DragEventHandler } from 'react';
import { type RDT_RowData, type RDT_TableInstance } from '../../types';
import styles from './buttons.module.css';

export interface RDT_GrabHandleButtonProps<TData extends RDT_RowData>
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  location?: 'column' | 'row';
  onDragEnd: DragEventHandler<HTMLButtonElement>;
  onDragStart: DragEventHandler<HTMLButtonElement>;
  table: RDT_TableInstance<TData>;
}

export const RDT_GrabHandleButton = <TData extends RDT_RowData>({
  location,
  onDragEnd,
  onDragStart,
  table,
  className,
  style,
  title,
  ...rest
}: RDT_GrabHandleButtonProps<TData>) => {
  const {
    options: {
      icons: { DragHandleIcon },
      localization,
    },
  } = table;

  const buttonStyle: React.CSSProperties = {
    cursor: 'grab',
    opacity: location === 'row' ? 1 : 0.5,
    margin: '0 -0.1rem',
    padding: '2px',
    ...style,
  };

  const label = title ?? localization.move;

  return (
    <button
      type="button"
      className={[styles.grabHandleButton, className].filter(Boolean).join(' ')}
      style={buttonStyle}
      aria-label={label}
      title={label}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={(e) => {
        e.stopPropagation();
        rest?.onClick?.(e);
      }}
      {...rest}
    >
      <DragHandleIcon />
    </button>
  );
};
