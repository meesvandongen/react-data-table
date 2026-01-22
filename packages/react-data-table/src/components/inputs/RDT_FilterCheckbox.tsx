import { type InputHTMLAttributes } from 'react';
import {
  type RDT_Column,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
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
  ...rest
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

  const checkboxClassName = [
    styles.filterCheckbox,
    density === 'compact' && styles.filterCheckboxCompact,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <label className={styles.filterCheckboxLabel} title={filterLabel}>
      <input
        type="checkbox"
        className={checkboxClassName}
        checked={isChecked}
        ref={(el) => {
          if (el) {
            el.indeterminate = isIndeterminate;
          }
        }}
        onChange={handleChange}
        onClick={(e) => e.stopPropagation()}
        aria-label={filterLabel}
        {...rest}
      />
      <span className={styles.filterCheckboxText}>{filterLabel}</span>
    </label>
  );
};
