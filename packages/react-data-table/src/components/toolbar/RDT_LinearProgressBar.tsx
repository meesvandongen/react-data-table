import { type HTMLAttributes } from 'react';
import { type RDT_RowData, type RDT_TableInstance } from '../../types';
import styles from './toolbar.module.css';

export interface RDT_LinearProgressBarProps<TData extends RDT_RowData>
  extends HTMLAttributes<HTMLDivElement> {
  isTopToolbar: boolean;
  table: RDT_TableInstance<TData>;
}

export const RDT_LinearProgressBar = <TData extends RDT_RowData>({
  isTopToolbar,
  table,
  ...rest
}: RDT_LinearProgressBarProps<TData>) => {
  const { getState } = table;
  const { isSaving, showProgressBars } = getState();

  const isVisible =
    showProgressBars !== false && (showProgressBars || isSaving);

  const containerClassName = [
    styles.progressBarContainer,
    isTopToolbar
      ? styles.progressBarContainerTop
      : styles.progressBarContainerBottom,
    !isVisible && styles.progressBarHidden,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={containerClassName}
      role="progressbar"
      aria-busy={isVisible}
      aria-label="Loading"
      {...rest}
    >
      <div className={styles.progressBar}>
        <div className={styles.progressBarIndicator} />
      </div>
    </div>
  );
};
