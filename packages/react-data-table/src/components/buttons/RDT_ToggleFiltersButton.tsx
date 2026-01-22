import { type HTMLAttributes } from 'react';
import { type RDT_RowData, type RDT_TableInstance } from '../../types';
import styles from './buttons.module.css';

export interface RDT_ToggleFiltersButtonProps<TData extends RDT_RowData>
  extends HTMLAttributes<HTMLButtonElement> {
  table: RDT_TableInstance<TData>;
}

export const RDT_ToggleFiltersButton = <TData extends RDT_RowData>({
  table,
  title,
  ...rest
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

  const handleToggleShowFilters = () => {
    setShowColumnFilters(!showColumnFilters);
  };

  const label = title ?? localization.showHideFilters;

  const buttonClassName = [
    styles.iconButton,
    showColumnFilters && styles.iconButtonActive,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={buttonClassName}
      aria-label={label}
      title={label}
      onClick={handleToggleShowFilters}
      {...rest}
    >
      {showColumnFilters ? <FilterListOffIcon /> : <FilterListIcon />}
    </button>
  );
};
