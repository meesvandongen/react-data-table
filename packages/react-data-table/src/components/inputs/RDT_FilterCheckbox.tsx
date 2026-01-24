import { type InputHTMLAttributes } from 'react';
import {
  type RDT_Column,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import { RDT_Checkbox } from './RDT_Checkbox';
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
        <RDT_Checkbox
          compact={isCompact}
          checked={isChecked}
          indeterminate={isIndeterminate}
          onChange={handleChange}
          aria-label={filterLabel}
          className={className}
        />
        <span className={styles.filterCheckboxText}>{filterLabel}</span>
      </label>
    </RDT_Tooltip>
  );
};
