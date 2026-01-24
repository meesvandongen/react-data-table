import { ToggleButton } from 'react-aria-components';
import { type RDT_RowData, type RDT_TableInstance } from '../../types';
import { RDT_Tooltip } from '../tooltip/RDT_Tooltip';
import styles from './buttons.module.css';

export interface RDT_ToggleGlobalFilterButtonProps<TData extends RDT_RowData> {
  table: RDT_TableInstance<TData>;
  title?: string;
}

export const RDT_ToggleGlobalFilterButton = <TData extends RDT_RowData>({
  table,
  title,
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

  const handleToggleSearch = (isSelected: boolean) => {
    setShowGlobalFilter(isSelected);
    if (isSelected) {
      queueMicrotask(() => searchInputRef.current?.focus());
    }
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
    <RDT_Tooltip content={label} isDisabled={isDisabled}>
      <ToggleButton
        className={buttonClassName}
        aria-label={label}
        isSelected={showGlobalFilter}
        onChange={handleToggleSearch}
        isDisabled={isDisabled}
      >
        {showGlobalFilter ? <SearchOffIcon /> : <SearchIcon />}
      </ToggleButton>
    </RDT_Tooltip>
  );
};
