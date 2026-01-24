import {
  type ChangeEvent,
  type HTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { type RDT_RowData, type RDT_TableInstance } from '../../types';
import { RDT_FilterOptionMenu } from '../menus/RDT_FilterOptionMenu';
import styles from './inputs.module.css';

// Simple debounce function
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
): T {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return ((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => func(...args), wait);
  }) as T;
}

export interface RDT_GlobalFilterTextFieldProps<TData extends RDT_RowData>
  extends HTMLAttributes<HTMLDivElement> {
  table: RDT_TableInstance<TData>;
}

export const RDT_GlobalFilterTextField = <TData extends RDT_RowData>({
  table,
  ...rest
}: RDT_GlobalFilterTextFieldProps<TData>) => {
  const {
    getState,
    options: {
      enableGlobalFilterModes,
      icons: { CloseIcon, SearchIcon },
      localization,
      manualFiltering,
    },
    refs: { searchInputRef },
    setGlobalFilter,
  } = table;
  const { showGlobalFilter } = getState();

  const isMounted = useRef(false);
  const filterModeButtonRef = useRef<HTMLButtonElement>(null);
  const [searchValue, setSearchValue] = useState(
    () => table.getState().globalFilter ?? '',
  );
  const [filterModeAnchorEl, setFilterModeAnchorEl] =
    useState<HTMLElement | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChangeDebounced = useCallback(
    debounce(
      (value: string) => {
        setGlobalFilter(value || undefined);
      },
      manualFiltering ? 500 : 250,
    ),
    [manualFiltering, setGlobalFilter],
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    handleChangeDebounced(value);
  };

  const handleClear = () => {
    setSearchValue('');
    setGlobalFilter(undefined);
  };

  const handleOpenFilterModeMenu = () => {
    setFilterModeAnchorEl(filterModeButtonRef.current);
  };

  useEffect(() => {
    if (isMounted.current) {
      const globalFilter = table.getState().globalFilter;
      if (globalFilter === undefined) {
        setSearchValue('');
      } else if (globalFilter !== searchValue) {
        setSearchValue(globalFilter);
      }
    }
    isMounted.current = true;
  }, [table.getState().globalFilter]);

  const containerClassName = [
    styles.globalFilterContainer,
    !showGlobalFilter && styles.globalFilterHidden,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClassName} {...rest}>
      <div className={styles.globalFilterWrapper}>
        {enableGlobalFilterModes ? (
          <button
            ref={filterModeButtonRef}
            type="button"
            className={styles.globalFilterIconButton}
            onClick={handleOpenFilterModeMenu}
            aria-label={localization.changeSearchMode}
            title={localization.changeSearchMode}
          >
            <SearchIcon />
          </button>
        ) : (
          <span className={styles.globalFilterIcon}>
            <SearchIcon />
          </span>
        )}
        <input
          ref={searchInputRef}
          type="text"
          className={styles.globalFilterInput}
          value={searchValue}
          onChange={handleChange}
          placeholder={localization.search}
          autoComplete="off"
          aria-label={localization.search}
        />
        <button
          type="button"
          className={styles.globalFilterClear}
          onClick={handleClear}
          disabled={!searchValue?.length}
          aria-label={localization.clearSearch}
          title={localization.clearSearch}
        >
          <CloseIcon />
        </button>
      </div>
      {enableGlobalFilterModes && (
        <RDT_FilterOptionMenu
          anchorEl={filterModeAnchorEl}
          setAnchorEl={setFilterModeAnchorEl}
          table={table}
        />
      )}
    </div>
  );
};
