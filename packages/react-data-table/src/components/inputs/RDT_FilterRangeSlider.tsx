import { type InputHTMLAttributes, useEffect, useRef, useState } from 'react';
import { Slider, SliderThumb, SliderTrack } from 'react-aria-components';
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

  const handleChange = (values: number[]) => {
    setFilterValues([values[0], values[1]]);
  };

  const handleChangeEnd = (values: number[]) => {
    if (values[0] <= min && values[1] >= max) {
      // If the user has selected the entire range, remove the filter
      column.setFilterValue(undefined);
    } else {
      column.setFilterValue([values[0], values[1]]);
    }
  };

  // Prevent moving the focus to the next/prev cell when using the arrow keys
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.stopPropagation();
    }
  };

  const handleMinInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Number(event.target.value);
    setFilterValues((prev) => [newMin, prev[1]]);
  };

  const handleMaxInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Number(event.target.value);
    setFilterValues((prev) => [prev[0], newMax]);
  };

  const handleInputCommit = () => {
    if (filterValues[0] <= min && filterValues[1] >= max) {
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
          onChange={handleMinInputChange}
          onBlur={handleInputCommit}
          onKeyDown={(e) => {
            handleKeyDown(e);
            if (e.key === 'Enter') handleInputCommit();
          }}
          aria-label={localization.min}
          placeholder={localization.min}
          {...rest}
        />
        <Slider
          className={styles.ariaSlider}
          minValue={min}
          maxValue={max}
          value={filterValues}
          onChange={handleChange}
          onChangeEnd={handleChangeEnd}
          aria-label={`${localization.min} - ${localization.max}`}
        >
          <SliderTrack className={styles.ariaSliderTrack}>
            {({ state }) => (
              <>
                <div
                  className={styles.ariaSliderFill}
                  style={{
                    left: `${state.getThumbPercent(0) * 100}%`,
                    width: `${(state.getThumbPercent(1) - state.getThumbPercent(0)) * 100}%`,
                  }}
                />
                <SliderThumb
                  className={styles.ariaSliderThumb}
                  index={0}
                  aria-label={localization.min}
                />
                <SliderThumb
                  className={styles.ariaSliderThumb}
                  index={1}
                  aria-label={localization.max}
                />
              </>
            )}
          </SliderTrack>
        </Slider>
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
          onChange={handleMaxInputChange}
          onBlur={handleInputCommit}
          onKeyDown={(e) => {
            handleKeyDown(e);
            if (e.key === 'Enter') handleInputCommit();
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
