import { type InputHTMLAttributes, useEffect, useRef, useState } from 'react';
import {
  type RDT_Header,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import styles from './inputs.module.css';

export interface RDT_FilterRangeSliderProps<TData extends RDT_RowData>
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  header: RDT_Header<TData>;
  table: RDT_TableInstance<TData>;
}

export const RDT_FilterRangeSlider = <TData extends RDT_RowData>({
  header,
  table,
  className,
  ...rest
}: RDT_FilterRangeSliderProps<TData>) => {
  const {
    options: { enableColumnFilterModes, localization },
    refs: { filterInputRefs },
  } = table;
  const { column } = header;
  const { columnDef } = column;

  const currentFilterOption = columnDef._filterFn;

  const showChangeModeButton =
    enableColumnFilterModes && columnDef.enableColumnFilterModes !== false;

  let [min, max] =
    rest.min !== undefined && rest.max !== undefined
      ? [Number(rest.min), Number(rest.max)]
      : (column.getFacetedMinMaxValues() ?? [0, 1]);

  // Fix potential TanStack Table bugs where min or max is an array
  if (Array.isArray(min)) min = min[0];
  if (Array.isArray(max)) max = max[0];
  if (min === null) min = 0;
  if (max === null) max = 1;

  const [filterValues, setFilterValues] = useState<[number, number]>([
    min,
    max,
  ]);
  const columnFilterValue = column.getFilterValue();

  const isMounted = useRef(false);

  // Prevent moving the focus to the next/prev cell when using the arrow keys
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.stopPropagation();
    }
  };

  const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Number(event.target.value);
    setFilterValues((prev) => [newMin, prev[1]]);
  };

  const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Number(event.target.value);
    setFilterValues((prev) => [prev[0], newMax]);
  };

  const handleCommit = () => {
    if (filterValues[0] <= min && filterValues[1] >= max) {
      // If the user has selected the entire range, remove the filter
      column.setFilterValue(undefined);
    } else {
      column.setFilterValue(filterValues);
    }
  };

  useEffect(() => {
    if (isMounted.current) {
      if (columnFilterValue === undefined) {
        setFilterValues([min, max]);
      } else if (Array.isArray(columnFilterValue)) {
        setFilterValues(columnFilterValue as [number, number]);
      }
    }
    isMounted.current = true;
  }, [columnFilterValue, min, max]);

  const sliderClassName = [styles.filterRangeSlider, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.filterRangeSliderContainer}>
      <div className={styles.filterRangeSliderInputs}>
        <input
          ref={(node) => {
            if (node && filterInputRefs.current) {
              filterInputRefs.current[`${column.id}-0`] = node;
            }
          }}
          type="number"
          className={styles.filterRangeSliderInput}
          value={filterValues[0]}
          min={min}
          max={max}
          onChange={handleMinChange}
          onBlur={handleCommit}
          onKeyDown={(e) => {
            handleKeyDown(e);
            if (e.key === 'Enter') handleCommit();
          }}
          aria-label={localization.min}
          placeholder={localization.min}
          {...rest}
        />
        <input
          type="range"
          className={sliderClassName}
          value={filterValues[0]}
          min={min}
          max={max}
          onChange={handleMinChange}
          onMouseUp={handleCommit}
          onKeyDown={handleKeyDown}
          aria-label={`${localization.min} slider`}
        />
        <input
          type="range"
          className={sliderClassName}
          value={filterValues[1]}
          min={min}
          max={max}
          onChange={handleMaxChange}
          onMouseUp={handleCommit}
          onKeyDown={handleKeyDown}
          aria-label={`${localization.max} slider`}
        />
        <input
          ref={(node) => {
            if (node && filterInputRefs.current) {
              filterInputRefs.current[`${column.id}-1`] = node;
            }
          }}
          type="number"
          className={styles.filterRangeSliderInput}
          value={filterValues[1]}
          min={min}
          max={max}
          onChange={handleMaxChange}
          onBlur={handleCommit}
          onKeyDown={(e) => {
            handleKeyDown(e);
            if (e.key === 'Enter') handleCommit();
          }}
          aria-label={localization.max}
          placeholder={localization.max}
          {...rest}
        />
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
    </div>
  );
};
