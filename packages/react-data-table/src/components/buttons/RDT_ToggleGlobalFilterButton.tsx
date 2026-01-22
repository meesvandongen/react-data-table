import { type HTMLAttributes } from 'react';
import { type RDT_RowData, type RDT_TableInstance } from '../../types';
import styles from './buttons.module.css';

export interface RDT_ToggleGlobalFilterButtonProps<TData extends RDT_RowData>
  extends HTMLAttributes<HTMLButtonElement> {
  table: RDT_TableInstance<TData>;
}

export const RDT_ToggleGlobalFilterButton = <TData extends RDT_RowData>({
  table,
  title,
  ...rest
}: RDT_ToggleGlobalFilterButtonProps<TData>) => {
  const {
    getState,
    options: {
      icons: { SearchIcon, SearchOffIcon },
      localization,
    },
    refs: { searchInputRef },
    setShowGlobalFilter,
  } = table;
  const { globalFilter, showGlobalFilter } = getState();

  const handleToggleSearch = () => {
    setShowGlobalFilter(!showGlobalFilter);
    queueMicrotask(() => searchInputRef.current?.focus());
  };

  const label = title ?? localization.showHideSearch;
  const isDisabled = !!globalFilter && showGlobalFilter;

  const buttonClassName = [
    styles.iconButton,
    showGlobalFilter && styles.iconButtonActive,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={buttonClassName}
      aria-label={label}
      title={label}
      disabled={isDisabled}
      onClick={handleToggleSearch}
      {...rest}
    >
      {showGlobalFilter ? <SearchOffIcon /> : <SearchIcon />}
    </button>
  );
};
