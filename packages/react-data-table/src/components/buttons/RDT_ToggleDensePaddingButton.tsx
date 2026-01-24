import { Button } from 'react-aria-components';
import { type RDT_RowData, type RDT_TableInstance } from '../../types';
import { RDT_Tooltip } from '../tooltip/RDT_Tooltip';
import styles from './buttons.module.css';

export interface RDT_ToggleDensePaddingButtonProps<TData extends RDT_RowData> {
  table: RDT_TableInstance<TData>;
  title?: string;
}

export const RDT_ToggleDensePaddingButton = <TData extends RDT_RowData>({
  table,
  title,
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
    <RDT_Tooltip content={label}>
      <Button
        className={styles.iconButton}
        aria-label={label}
        onPress={handleToggleDensePadding}
      >
        {density === 'compact' ? (
          <DensitySmallIcon />
        ) : density === 'comfortable' ? (
          <DensityMediumIcon />
        ) : (
          <DensityLargeIcon />
        )}
      </Button>
    </RDT_Tooltip>
  );
};
