import { type InputHTMLAttributes } from 'react';
import { Checkbox } from 'react-aria-components';
import clsx from 'clsx';
import {
  type RDT_Column,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import { RDT_Tooltip } from '../tooltip/RDT_Tooltip';
import styles from './inputs.module.css';

export interface RDT_FilterCheckboxProps<TData extends RDT_RowData>
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  column: RDT_Column<TData>;
  table: RDT_TableInstance<TData>;
}

export const RDT_FilterCheckbox = <TData extends RDT_RowData>({
  column,
  table,
  className,
}: RDT_FilterCheckboxProps<TData>) => {
  const {
    getState,
    options: { localization },
  } = table;
  const { density } = getState();
  const { columnDef } = column;

  const filterLabel = localization.filterByColumn?.replace(
    '{column}',
    String(columnDef.header),
  );

  const filterValue = column.getFilterValue();
  const isChecked = filterValue === 'true';
  const isIndeterminate = filterValue === undefined;

  const handleChange = () => {
    // Cycle: undefined -> 'true' -> 'false' -> undefined
    column.setFilterValue(
      filterValue === undefined
        ? 'true'
        : filterValue === 'true'
          ? 'false'
          : undefined,
    );
  };

  const isCompact = density === 'compact';

  return (
    <RDT_Tooltip content={filterLabel}>
      <label className={styles.filterCheckboxLabel}>
        <Checkbox
          className={clsx(
            styles.ariaCheckbox,
            isCompact && styles.ariaCheckboxCompact,
            className,
          )}
          isSelected={isChecked}
          isIndeterminate={isIndeterminate}
          onChange={handleChange}
          aria-label={filterLabel}
          slot={null}
        >
          <div className={styles.checkboxBox}>
            <svg
              viewBox="0 0 18 18"
              aria-hidden="true"
              className={styles.checkboxIcon}
            >
              {isIndeterminate ? (
                <rect x={3} y={8} width={12} height={2} fill="currentColor" />
              ) : (
                <polyline
                  points="3,9 7,13 15,5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
          </div>
        </Checkbox>
        <span className={styles.filterCheckboxText}>{filterLabel}</span>
      </label>
    </RDT_Tooltip>
  );
};
