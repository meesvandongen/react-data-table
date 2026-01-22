import { type HTMLAttributes, type MouseEvent, useRef } from 'react';
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

  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    if (selectAll) {
      onSelectAllChange(event);
    } else {
      onSelectionChange!(event);
    }
  };

  const handleClick = (e: MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  const isCompact = density === 'compact';
  const isMultiSelect = enableMultiRowSelection !== false;

  // Set indeterminate state via ref (can't be set via attribute)
  if (inputRef.current && isMultiSelect) {
    inputRef.current.indeterminate = !!isIndeterminate;
  }

  const label = selectAll
    ? localization.toggleSelectAll
    : localization.toggleSelectRow;

  const inputClassName = isMultiSelect
    ? [styles.checkbox, isCompact && styles.checkboxCompact]
        .filter(Boolean)
        .join(' ')
    : [styles.radio, isCompact && styles.radioCompact]
        .filter(Boolean)
        .join(' ');

  return (
    <div className={styles.checkboxContainer} title={label}>
      <input
        ref={inputRef}
        type={isMultiSelect ? 'checkbox' : 'radio'}
        className={inputClassName}
        checked={isChecked}
        disabled={isDisabled}
        onChange={handleChange}
        onClick={handleClick}
        aria-label={label}
        {...rest}
      />
    </div>
  );
};
