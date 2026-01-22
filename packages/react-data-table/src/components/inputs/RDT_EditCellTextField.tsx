import {
  type ChangeEvent,
  type FocusEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  useState,
} from 'react';
import {
  type RDT_Cell,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import { getValueAndLabel, parseFromValuesOrFunc } from '../../utils/utils';
import styles from './inputs.module.css';

export interface RDT_EditCellTextFieldProps<TData extends RDT_RowData>
  extends Omit<
    InputHTMLAttributes<HTMLInputElement | HTMLSelectElement>,
    'onChange'
  > {
  cell: RDT_Cell<TData>;
  table: RDT_TableInstance<TData>;
}

export const RDT_EditCellTextField = <TData extends RDT_RowData>({
  cell,
  table,
  className,
  ...rest
}: RDT_EditCellTextFieldProps<TData>) => {
  const {
    getState,
    options: { createDisplayMode, editDisplayMode },
    refs: { editInputRefs },
    setCreatingRow,
    setEditingCell,
    setEditingRow,
  } = table;
  const { column, row } = cell;
  const { columnDef } = column;
  const { creatingRow, editingRow } = getState();
  const { editSelectOptions, editVariant } = columnDef;

  const isCreating = creatingRow?.id === row.id;
  const isEditing = editingRow?.id === row.id;

  const [value, setValue] = useState(() => cell.getValue<string>());
  const [completesComposition, setCompletesComposition] = useState(true);

  const selectOptions = parseFromValuesOrFunc(editSelectOptions, {
    cell,
    column,
    row,
    table,
  });

  const isSelectEdit = editVariant === 'select';
  const isDisabled =
    parseFromValuesOrFunc(columnDef.enableEditing, row) === false;
  const showLabel = ['custom', 'modal'].includes(
    (isCreating ? createDisplayMode : editDisplayMode) as string,
  );

  const saveInputValueToRowCache = (newValue: string) => {
    // @ts-expect-error - _valuesCache is internal
    row._valuesCache[column.id] = newValue;
    if (isCreating) {
      setCreatingRow(row);
    } else if (isEditing) {
      setEditingRow(row);
    }
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setValue(event.target.value);
    if (isSelectEdit) {
      saveInputValueToRowCache(event.target.value);
    }
  };

  const handleBlur = (
    _event: FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    saveInputValueToRowCache(value);
    setEditingCell(null);
  };

  const handleEnterKeyDown = (
    event: KeyboardEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    if (event.key === 'Enter' && !event.shiftKey && completesComposition) {
      editInputRefs.current?.[column.id]?.blur();
    }
  };

  // Custom Edit component
  if (columnDef.Edit) {
    return <>{columnDef.Edit?.({ cell, column, row, table })}</>;
  }

  const inputClassName = [styles.editInput, className]
    .filter(Boolean)
    .join(' ');

  // Show label in modal mode
  if (showLabel) {
    return (
      <div className={styles.editFieldContainer}>
        <label className={styles.editFieldLabel} htmlFor={column.id}>
          {columnDef.header as string}
        </label>
        {isSelectEdit ? (
          <select
            ref={(ref) => {
              if (ref && editInputRefs.current) {
                editInputRefs.current[column.id] =
                  ref as unknown as HTMLInputElement;
              }
            }}
            id={column.id}
            name={column.id}
            className={inputClassName}
            value={value ?? ''}
            disabled={isDisabled}
            onChange={handleChange}
            onBlur={handleBlur}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleEnterKeyDown}
            {...(rest as any)}
          >
            <option value="" disabled>
              Select...
            </option>
            {selectOptions?.map((option) => {
              const { label, value } = getValueAndLabel(option);
              return (
                <option key={value} value={value}>
                  {label}
                </option>
              );
            })}
          </select>
        ) : (
          <input
            ref={(ref) => {
              if (ref && editInputRefs.current) {
                editInputRefs.current[column.id] = ref;
              }
            }}
            type="text"
            id={column.id}
            name={column.id}
            className={inputClassName}
            value={value ?? ''}
            disabled={isDisabled}
            autoComplete="off"
            onChange={handleChange}
            onBlur={handleBlur}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleEnterKeyDown}
            onCompositionStart={() => setCompletesComposition(false)}
            onCompositionEnd={() => setCompletesComposition(true)}
            {...rest}
          />
        )}
      </div>
    );
  }

  // Inline editing (table/row mode)
  if (isSelectEdit) {
    return (
      <select
        ref={(ref) => {
          if (ref && editInputRefs.current) {
            editInputRefs.current[column.id] =
              ref as unknown as HTMLInputElement;
          }
        }}
        name={column.id}
        className={inputClassName}
        value={value ?? ''}
        disabled={isDisabled}
        onChange={handleChange}
        onBlur={handleBlur}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleEnterKeyDown}
        aria-label={columnDef.header as string}
        {...(rest as any)}
      >
        <option value="" disabled>
          {columnDef.header as string}
        </option>
        {selectOptions?.map((option) => {
          const { label, value } = getValueAndLabel(option);
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
    );
  }

  return (
    <input
      ref={(ref) => {
        if (ref && editInputRefs.current) {
          editInputRefs.current[column.id] = ref;
        }
      }}
      type="text"
      name={column.id}
      className={inputClassName}
      value={value ?? ''}
      placeholder={columnDef.header as string}
      disabled={isDisabled}
      autoComplete="off"
      onChange={handleChange}
      onBlur={handleBlur}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={handleEnterKeyDown}
      onCompositionStart={() => setCompletesComposition(false)}
      onCompositionEnd={() => setCompletesComposition(true)}
      aria-label={columnDef.header as string}
      {...rest}
    />
  );
};
