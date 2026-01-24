import { type MouseEvent, useCallback, useEffect, useState } from 'react';
import {
  type RDT_Header,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import { getColumnFilterInfo } from '../../utils/column.utils';
import { RDT_FilterOptionMenu } from '../menus/RDT_FilterOptionMenu';
import { RDT_DateRangePicker } from './RDT_DateRangePicker';
import styles from './inputs.module.css';

export interface RDT_FilterDateRangePickerProps<TData extends RDT_RowData> {
  header: RDT_Header<TData>;
  table: RDT_TableInstance<TData>;
  granularity?: 'day' | 'hour' | 'minute' | 'second';
}

export const RDT_FilterDateRangePicker = <TData extends RDT_RowData>({
  header,
  table,
  granularity = 'day',
}: RDT_FilterDateRangePickerProps<TData>) => {
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

  const parseFilterValue = (
    value: unknown,
  ): { start: Date | null; end: Date | null } => {
    if (!value) return { start: null, end: null };
    if (Array.isArray(value)) {
      const [start, end] = value;
      return {
        start: start instanceof Date ? start : start ? new Date(start) : null,
        end: end instanceof Date ? end : end ? new Date(end) : null,
      };
    }
    return { start: null, end: null };
  };

  const [filterValue, setFilterValue] = useState<{
    start: Date | null;
    end: Date | null;
  }>(() => parseFilterValue(column.getFilterValue()));

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleChange = useCallback(
    (newValue: { start: Date | null; end: Date | null }) => {
      setFilterValue(newValue);
      if (!newValue.start && !newValue.end) {
        column.setFilterValue(undefined);
      } else {
        column.setFilterValue([newValue.start, newValue.end]);
      }
    },
    [column],
  );

  const handleClear = useCallback(() => {
    setFilterValue({ start: null, end: null });
    column.setFilterValue(undefined);
  }, [column]);

  const handleFilterMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Sync with external filter value changes
  useEffect(() => {
    const value = column.getFilterValue();
    if (value === undefined) {
      setFilterValue({ start: null, end: null });
    } else {
      setFilterValue(parseFilterValue(value));
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

  const hasValue = filterValue.start || filterValue.end;

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
          <RDT_DateRangePicker
            aria-label={placeholder}
            granularity={granularity}
            onChange={handleChange}
            value={filterValue}
          />

          {hasValue && (
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
