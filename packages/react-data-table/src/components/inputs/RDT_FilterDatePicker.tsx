import { type MouseEvent, useCallback, useEffect, useState } from 'react';
import {
  type RDT_Header,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import { getColumnFilterInfo } from '../../utils/column.utils';
import { RDT_FilterOptionMenu } from '../menus/RDT_FilterOptionMenu';
import { RDT_DatePicker } from './RDT_DatePicker';
import styles from './inputs.module.css';

export interface RDT_FilterDatePickerProps<TData extends RDT_RowData> {
  header: RDT_Header<TData>;
  table: RDT_TableInstance<TData>;
  granularity?: 'day' | 'hour' | 'minute' | 'second';
}

export const RDT_FilterDatePicker = <TData extends RDT_RowData>({
  header,
  table,
  granularity = 'day',
}: RDT_FilterDatePickerProps<TData>) => {
  const {
    options: {
      enableColumnFilterModes,
      icons: { CloseIcon, FilterListIcon },
      localization,
    },
  } = table;
  const { column } = header;
  const { columnDef } = column;

  const { allowedColumnFilterOptions, currentFilterOption } =
    getColumnFilterInfo({ header, table });

  const [filterValue, setFilterValue] = useState<Date | null>(() => {
    const value = column.getFilterValue();
    if (value instanceof Date) return value;
    if (typeof value === 'string' && value) {
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date;
    }
    return null;
  });

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleChange = useCallback(
    (newValue: Date | null) => {
      setFilterValue(newValue);
      column.setFilterValue(newValue ?? undefined);
    },
    [column],
  );

  const handleClear = useCallback(() => {
    setFilterValue(null);
    column.setFilterValue(undefined);
  }, [column]);

  const handleFilterMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Sync with external filter value changes
  useEffect(() => {
    const value = column.getFilterValue();
    if (value === undefined || value === null) {
      setFilterValue(null);
    } else if (value instanceof Date) {
      setFilterValue(value);
    } else if (typeof value === 'string' && value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setFilterValue(date);
      }
    }
  }, [column.getFilterValue()]);

  // Custom filter component
  if (columnDef.Filter) {
    return <>{columnDef.Filter?.({ column, header, table })}</>;
  }

  const placeholder = localization.filterByColumn?.replace(
    '{column}',
    String(columnDef.header),
  );

  const showChangeModeButton = !!(
    enableColumnFilterModes &&
    columnDef.enableColumnFilterModes !== false &&
    (allowedColumnFilterOptions === undefined ||
      !!allowedColumnFilterOptions?.length)
  );

  return (
    <>
      <div className={styles.filterContainer}>
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

        <div className={styles.dateFilterWrapper}>
          <RDT_DatePicker
            aria-label={placeholder}
            granularity={granularity}
            onChange={handleChange}
            value={filterValue}
          />

          {filterValue && (
            <button
              type="button"
              className={styles.dateFilterClearButton}
              onClick={handleClear}
              aria-label={localization.clearFilter}
              title={localization.clearFilter}
            >
              <CloseIcon />
            </button>
          )}
        </div>
      </div>

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

      <RDT_FilterOptionMenu
        anchorEl={anchorEl}
        header={header}
        setAnchorEl={setAnchorEl}
        setFilterValue={setFilterValue as any}
        table={table}
      />
    </>
  );
};
