import { type HTMLAttributes } from 'react';
import clsx from 'clsx';
import {
  type RDT_Row,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import {
  getIsRowSelected,
  getRDT_RowSelectionHandler,
  getRDT_SelectAllHandler,
} from '../../utils/row.utils';
import { RDT_Checkbox } from './RDT_Checkbox';
import { RDT_Tooltip } from '../tooltip/RDT_Tooltip';
import styles from './inputs.module.css';

export interface RDT_SelectCheckboxProps<TData extends RDT_RowData>
  extends Omit<HTMLAttributes<HTMLInputElement>, 'onChange'> {
  row?: RDT_Row<TData>;
  staticRowIndex?: number;
  table: RDT_TableInstance<TData>;
}

export const RDT_SelectCheckbox = <TData extends RDT_RowData>({
  row,
  staticRowIndex,
  table,
  ...rest
}: RDT_SelectCheckboxProps<TData>) => {
  const {
    getState,
    options: { enableMultiRowSelection, localization, selectAllMode },
  } = table;
  const { density, isLoading } = getState();

  const selectAll = !row;

  const allRowsSelected = selectAll
    ? selectAllMode === 'page'
      ? table.getIsAllPageRowsSelected()
      : table.getIsAllRowsSelected()
    : undefined;

  const isChecked = selectAll
    ? allRowsSelected
    : getIsRowSelected({ row, table });

  const isIndeterminate = selectAll
    ? !isChecked && table.getIsSomeRowsSelected()
    : row?.getIsSomeSelected() && row.getCanSelectSubRows();

  const isDisabled =
    isLoading || (row && !row.getCanSelect()) || row?.id === 'rdt-row-create';

  const onSelectionChange = row
    ? getRDT_RowSelectionHandler({
        row,
        staticRowIndex,
        table,
      })
    : undefined;

  const onSelectAllChange = getRDT_SelectAllHandler({ table });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (selectAll) {
      onSelectAllChange(e);
    } else {
      onSelectionChange?.(e);
    }
  };

  const isCompact = density === 'compact';
  const isMultiSelect = enableMultiRowSelection !== false;

  const label = selectAll
    ? localization.toggleSelectAll
    : localization.toggleSelectRow;

  // Single-select mode uses radio buttons
  if (!isMultiSelect) {
    return (
      <RDT_Tooltip content={label}>
        <div className={styles.checkboxContainer}>
          <input
            type="radio"
            className={clsx(styles.radio, isCompact && styles.radioCompact)}
            checked={isChecked}
            disabled={isDisabled}
            onChange={handleChange}
            onClick={(e) => e.stopPropagation()}
            aria-label={label}
            {...rest}
          />
        </div>
      </RDT_Tooltip>
    );
  }

  // Multi-select mode uses checkboxes
  return (
    <RDT_Tooltip content={label}>
      <div className={styles.checkboxContainer}>
        <RDT_Checkbox
          compact={isCompact}
          checked={isChecked}
          indeterminate={isIndeterminate}
          disabled={isDisabled}
          onChange={handleChange}
          onClick={(e) => e.stopPropagation()}
          aria-label={label}
          {...rest}
        />
      </div>
    </RDT_Tooltip>
  );
};
