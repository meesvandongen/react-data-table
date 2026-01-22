import { type HTMLAttributes } from 'react';
import { type RDT_RowData, type RDT_TableInstance } from '../../types';
import styles from './buttons.module.css';

export interface RDT_ToggleDensePaddingButtonProps<TData extends RDT_RowData>
  extends HTMLAttributes<HTMLButtonElement> {
  table: RDT_TableInstance<TData>;
}

export const RDT_ToggleDensePaddingButton = <TData extends RDT_RowData>({
  table,
  title,
  ...rest
}: RDT_ToggleDensePaddingButtonProps<TData>) => {
  const {
    getState,
    options: {
      icons: { DensityLargeIcon, DensityMediumIcon, DensitySmallIcon },
      localization,
    },
    setDensity,
  } = table;
  const { density } = getState();

  const handleToggleDensePadding = () => {
    const nextDensity =
      density === 'comfortable'
        ? 'compact'
        : density === 'compact'
          ? 'spacious'
          : 'comfortable';
    setDensity(nextDensity);
  };

  const label = title ?? localization.toggleDensity;

  return (
    <button
      type="button"
      className={styles.iconButton}
      aria-label={label}
      title={label}
      onClick={handleToggleDensePadding}
      {...rest}
    >
      {density === 'compact' ? (
        <DensitySmallIcon />
      ) : density === 'comfortable' ? (
        <DensityMediumIcon />
      ) : (
        <DensityLargeIcon />
      )}
    </button>
  );
};
