import { type HTMLAttributes } from 'react';
import clsx from 'clsx';
import { type RDT_RowData, type RDT_TableInstance } from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
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
  const {
    getState,
    options: { linearProgressProps },
  } = table;
  const { isSaving, showProgressBars } = getState();

  const isVisible =
    showProgressBars !== false && (showProgressBars || isSaving);

  const progressProps = {
    ...parseFromValuesOrFunc(linearProgressProps, {
      isTopToolbar,
      table,
    }),
    ...rest,
  };

  return (
    <div
      {...progressProps}
      className={clsx(
        styles.progressBarContainer,
        isTopToolbar
          ? styles.progressBarContainerTop
          : styles.progressBarContainerBottom,
        !isVisible && styles.progressBarHidden,
        progressProps?.className,
      )}
      role="progressbar"
      aria-busy={isVisible}
      aria-label="Loading"
    >
      <div className={styles.progressBar}>
        <div className={styles.progressBarIndicator} />
      </div>
    </div>
  );
};
