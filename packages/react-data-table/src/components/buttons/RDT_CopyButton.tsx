import { type ButtonHTMLAttributes, type MouseEvent, useState } from 'react';
import {
  type RDT_Cell,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import styles from './buttons.module.css';

export interface RDT_CopyButtonProps<TData extends RDT_RowData>
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  cell: RDT_Cell<TData>;
  table: RDT_TableInstance<TData>;
}

export const RDT_CopyButton = <TData extends RDT_RowData>({
  cell,
  table,
  className,
  children,
  ...rest
}: RDT_CopyButtonProps<TData>) => {
  const {
    options: { localization },
  } = table;

  const [copied, setCopied] = useState(false);

  const handleCopy = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const value = cell.getValue();
    navigator.clipboard.writeText(String(value ?? ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 4000);
  };

  const label = copied
    ? localization.copiedToClipboard
    : localization.clickToCopy;

  return (
    <button
      type="button"
      className={[styles.copyButton, className].filter(Boolean).join(' ')}
      title={label}
      aria-label={label}
      onClick={handleCopy}
      {...rest}
    >
      {children ?? String(cell.getValue() ?? '')}
    </button>
  );
};
