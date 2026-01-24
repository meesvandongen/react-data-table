import {
  type ChangeEvent,
  type InputHTMLAttributes,
  type MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  type RDT_Header,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import {
  getColumnFilterInfo,
  useDropdownOptions,
} from '../../utils/column.utils';
import { getValueAndLabel } from '../../utils/utils';
import { RDT_FilterOptionMenu } from '../menus/RDT_FilterOptionMenu';
import {
  RDT_Autocomplete,
  type RDT_AutocompleteOption,
} from './RDT_Autocomplete';
import { RDT_MultiSelect, type RDT_MultiSelectOption } from './RDT_MultiSelect';
import { RDT_Select, type RDT_SelectOption } from './RDT_Select';
import styles from './inputs.module.css';

export interface RDT_FilterTextFieldProps<TData extends RDT_RowData>
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  header: RDT_Header<TData>;
  rangeFilterIndex?: number;
  table: RDT_TableInstance<TData>;
}

// Simple debounce implementation
function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
): T & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  const debounced = (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
  debounced.cancel = () => {
    if (timeoutId) clearTimeout(timeoutId);
  };
  return debounced as T & { cancel: () => void };
}

export const RDT_FilterTextField = <TData extends RDT_RowData>({
  header,
  rangeFilterIndex,
  table,
  className,
  ...rest
}: RDT_FilterTextFieldProps<TData>) => {
  const {
    options: {
      enableColumnFilterModes,
      icons: { CloseIcon, FilterListIcon },
      localization,
      manualFiltering,
    },
    refs: { filterInputRefs },
    setColumnFilterFns,
  } = table;

  const { column } = header;
  const { columnDef } = column;

  const {
    allowedColumnFilterOptions,
    currentFilterOption,
    facetedUniqueValues,
    isAutocompleteFilter,
    isMultiSelectFilter,
    isRangeFilter,
    isSelectFilter,
    isTextboxFilter,
  } = getColumnFilterInfo({ header, table });

  const dropdownOptions = useDropdownOptions({ header, table });

  const filterChipLabel = ['empty', 'notEmpty'].includes(currentFilterOption)
    ? localization[
        `filter${
          currentFilterOption?.charAt?.(0)?.toUpperCase() +
          currentFilterOption?.slice(1)
        }` as keyof typeof localization
      ]
    : '';

  const filterPlaceholder = !isRangeFilter
    ? localization.filterByColumn?.replace('{column}', String(columnDef.header))
    : rangeFilterIndex === 0
      ? localization.min
      : rangeFilterIndex === 1
        ? localization.max
        : '';

  const showChangeModeButton = !!(
    enableColumnFilterModes &&
    columnDef.enableColumnFilterModes !== false &&
    !rangeFilterIndex &&
    (allowedColumnFilterOptions === undefined ||
      !!allowedColumnFilterOptions?.length)
  );

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [filterValue, setFilterValue] = useState<string | string[]>(() =>
    isMultiSelectFilter
      ? (column.getFilterValue() as string[]) || []
      : isRangeFilter
        ? (column.getFilterValue() as [string, string])?.[
            rangeFilterIndex as number
          ] || ''
        : ((column.getFilterValue() as string) ?? ''),
  );

  const handleChangeDebounced = useCallback(
    debounce(
      (newValue: any) => {
        if (isRangeFilter) {
          column.setFilterValue((old: Array<Date | null | number | string>) => {
            const newFilterValues = old ?? ['', ''];
            newFilterValues[rangeFilterIndex as number] = newValue ?? undefined;
            return newFilterValues;
          });
        } else {
          column.setFilterValue(newValue ?? undefined);
        }
      },
      isTextboxFilter ? (manualFiltering ? 400 : 200) : 1,
    ),
    [],
  );

  const handleChange = (newValue: any) => {
    setFilterValue(newValue ?? '');
    handleChangeDebounced(newValue);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleChange(event.target.value);
  };

  const handleClear = () => {
    if (isMultiSelectFilter) {
      setFilterValue([]);
      column.setFilterValue([]);
    } else if (isRangeFilter) {
      setFilterValue('');
      column.setFilterValue((old: [string | undefined, string | undefined]) => {
        const newFilterValues = (Array.isArray(old) && old) || ['', ''];
        newFilterValues[rangeFilterIndex as number] = undefined;
        return newFilterValues;
      });
    } else {
      setFilterValue('');
      column.setFilterValue(undefined);
    }
  };

  const handleClearEmptyFilterChip = () => {
    setFilterValue('');
    column.setFilterValue(undefined);
    setColumnFilterFns((prev) => ({
      ...prev,
      [header.id]: allowedColumnFilterOptions?.[0] ?? 'fuzzy',
    }));
  };

  const handleFilterMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      const filterValue = column.getFilterValue();
      if (filterValue === undefined) {
        handleClear();
      } else if (isRangeFilter && rangeFilterIndex !== undefined) {
        setFilterValue((filterValue as [string, string])[rangeFilterIndex]);
      } else {
        setFilterValue(filterValue as string);
      }
    }
    isMounted.current = true;
  }, [column.getFilterValue()]);

  // Convert dropdown options to component format
  const selectOptions = useMemo((): RDT_SelectOption[] => {
    return (
      dropdownOptions?.map((option) => {
        const { label, value } = getValueAndLabel(option);
        const count = facetedUniqueValues.get(value);
        const displayLabel =
          !columnDef.filterSelectOptions && count !== undefined
            ? `${label} (${count})`
            : label;
        return {
          label: displayLabel,
          value: String(value),
        };
      }) ?? []
    );
  }, [dropdownOptions, facetedUniqueValues, columnDef.filterSelectOptions]);

  const multiSelectOptions = useMemo((): RDT_MultiSelectOption[] => {
    return selectOptions;
  }, [selectOptions]);

  const autocompleteOptions = useMemo((): RDT_AutocompleteOption[] => {
    return selectOptions;
  }, [selectOptions]);

  // Custom filter component
  if (columnDef.Filter) {
    return (
      <>{columnDef.Filter?.({ column, header, rangeFilterIndex, table })}</>
    );
  }

  const inputClassName = [styles.filterInput, className]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <div className={styles.filterContainer}>
        {/* Change filter mode button */}
        {showChangeModeButton && (
          <button
            type="button"
            className={styles.filterModeButton}
            onClick={handleFilterMenuOpen}
            aria-label={localization.changeFilterMode}
            title={localization.changeFilterMode}
          >
            <FilterListIcon />
          </button>
        )}

        {/* Empty/Not Empty chip */}
        {filterChipLabel && (
          <span className={styles.filterChip}>
            {filterChipLabel}
            <button
              type="button"
              className={styles.filterChipDelete}
              onClick={handleClearEmptyFilterChip}
              aria-label={localization.clearFilter}
            >
              <CloseIcon />
            </button>
          </span>
        )}

        {/* Input field */}
        {!filterChipLabel && (
          <>
            {isMultiSelectFilter ? (
              <RDT_MultiSelect
                aria-label={filterPlaceholder}
                onChange={handleChange}
                options={multiSelectOptions}
                placeholder={filterPlaceholder}
                value={Array.isArray(filterValue) ? filterValue : []}
              />
            ) : isSelectFilter ? (
              <RDT_Select
                aria-label={filterPlaceholder}
                onChange={handleChange}
                options={selectOptions}
                placeholder={filterPlaceholder}
                value={filterValue as string}
              />
            ) : isAutocompleteFilter ? (
              <RDT_Autocomplete
                aria-label={filterPlaceholder}
                onChange={handleChange}
                options={autocompleteOptions}
                placeholder={filterPlaceholder}
                value={filterValue as string}
              />
            ) : (
              <>
                <input
                  ref={(inputRef) => {
                    if (inputRef && filterInputRefs.current) {
                      filterInputRefs.current[
                        `${column.id}-${rangeFilterIndex ?? 0}`
                      ] = inputRef;
                    }
                  }}
                  type="text"
                  className={inputClassName}
                  value={filterValue as string}
                  onChange={handleInputChange}
                  placeholder={filterPlaceholder}
                  aria-label={filterPlaceholder}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  {...rest}
                />

                {/* Clear button */}
                {(filterValue?.toString()?.length ?? 0) > 0 && (
                  <button
                    type="button"
                    className={styles.filterClearButton}
                    onClick={handleClear}
                    aria-label={localization.clearFilter}
                    title={localization.clearFilter}
                  >
                    <CloseIcon />
                  </button>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Filter mode helper text */}
      {showChangeModeButton && (
        <span className={styles.filterHelperText}>
          {localization.filterMode.replace(
            '{filterType}',
            localization[
              `filter${
                currentFilterOption?.charAt(0)?.toUpperCase() +
                currentFilterOption?.slice(1)
              }` as keyof typeof localization
            ] as string,
          )}
        </span>
      )}

      {/* Filter option menu */}
      <RDT_FilterOptionMenu
        anchorEl={anchorEl}
        header={header}
        setAnchorEl={setAnchorEl}
        setFilterValue={setFilterValue}
        table={table}
      />
    </>
  );
};
