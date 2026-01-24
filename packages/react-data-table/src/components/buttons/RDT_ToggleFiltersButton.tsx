import { ToggleButton } from 'react-aria-components';
import { type RDT_RowData, type RDT_TableInstance } from '../../types';
import { RDT_Tooltip } from '../tooltip/RDT_Tooltip';
import styles from './buttons.module.css';

export interface RDT_ToggleFiltersButtonProps<TData extends RDT_RowData> {
  table: RDT_TableInstance<TData>;
  title?: string;
}

export const RDT_ToggleFiltersButton = <TData extends RDT_RowData>({
  table,
  title,
}: RDT_ToggleFiltersButtonProps<TData>) => {
  const {
    getState,
    options: {
      icons: { FilterListIcon, FilterListOffIcon },
      localization,
    },
    setShowColumnFilters,
  } = table;
  const { showColumnFilters } = getState();

  const handleToggleShowFilters = (isSelected: boolean) => {
    setShowColumnFilters(isSelected);
  };

  const label = title ?? localization.showHideFilters;

  const buttonClassName = [
    styles.iconButton,
    showColumnFilters && styles.iconButtonActive,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <RDT_Tooltip content={label}>
      <ToggleButton
        className={buttonClassName}
        aria-label={label}
        isSelected={showColumnFilters}
        onChange={handleToggleShowFilters}
      >
        {showColumnFilters ? <FilterListOffIcon /> : <FilterListIcon />}
      </ToggleButton>
    </RDT_Tooltip>
  );
};
