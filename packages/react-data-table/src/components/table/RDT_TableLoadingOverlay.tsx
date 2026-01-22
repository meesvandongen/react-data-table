import { type HTMLAttributes } from 'react';
import clsx from 'clsx';
import { type RDT_RowData, type RDT_TableInstance } from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import styles from './table.module.css';

export interface RDT_TableLoadingOverlayProps<TData extends RDT_RowData>
  extends HTMLAttributes<HTMLDivElement> {
  table: RDT_TableInstance<TData>;
}

export const RDT_TableLoadingOverlay = <TData extends RDT_RowData>({
  table,
  className,
  ...rest
}: RDT_TableLoadingOverlayProps<TData>) => {
  const {
    options: { localization, loadingOverlayProps },
  } = table;

  const overlayProps = {
    ...parseFromValuesOrFunc(loadingOverlayProps, { table }),
    ...rest,
  };

  return (
    <div
      id="rdt-progress"
      role="progressbar"
      aria-label={localization.noRecordsToDisplay}
      {...overlayProps}
      className={clsx(
        styles.loadingOverlay,
        overlayProps?.className,
        className,
      )}
    >
      <div className={styles.loadingSpinner} />
    </div>
  );
};
