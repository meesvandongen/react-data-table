import { type HTMLAttributes } from 'react';
import {
  type RDT_Row,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import styles from './buttons.module.css';

export interface RDT_EditActionButtonsProps<TData extends RDT_RowData>
  extends HTMLAttributes<HTMLDivElement> {
  row: RDT_Row<TData>;
  table: RDT_TableInstance<TData>;
  variant?: 'icon' | 'text';
}

export const RDT_EditActionButtons = <TData extends RDT_RowData>({
  row,
  table,
  variant = 'icon',
  className,
  ...rest
}: RDT_EditActionButtonsProps<TData>) => {
  const {
    getState,
    options: {
      icons: { CancelIcon, SaveIcon },
      localization,
      onCreatingRowCancel,
      onCreatingRowSave,
      onEditingRowCancel,
      onEditingRowSave,
    },
    refs: { editInputRefs },
    setCreatingRow,
    setEditingRow,
  } = table;

  const { creatingRow, editingRow, isSaving } = getState();

  const isCreating = creatingRow?.id === row.id;
  const isEditing = editingRow?.id === row.id;

  const handleCancel = () => {
    if (isCreating) {
      onCreatingRowCancel?.({ row, table });
      setCreatingRow(null);
    } else if (isEditing) {
      onEditingRowCancel?.({ row, table });
      setEditingRow(null);
    }
    row._valuesCache = {} as any; // Reset values cache
  };

  const handleSubmitRow = () => {
    // Look for auto-filled input values
    Object.values(editInputRefs.current ?? {})
      .filter((inputRef) => row.id === inputRef?.name?.split('_')?.[0])
      ?.forEach((input) => {
        if (
          input.value !== undefined &&
          Object.prototype.hasOwnProperty.call(
            row?._valuesCache as object,
            input.name,
          )
        ) {
          // @ts-expect-error
          row._valuesCache[input.name] = input.value;
        }
      });

    if (isCreating) {
      onCreatingRowSave?.({
        exitCreatingMode: () => setCreatingRow(null),
        row,
        table,
        values: row._valuesCache,
      });
    } else if (isEditing) {
      onEditingRowSave?.({
        exitEditingMode: () => setEditingRow(null),
        row,
        table,
        values: row?._valuesCache,
      });
    }
  };

  const containerClassName = [styles.editActionButtons, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={containerClassName}
      onClick={(e) => e.stopPropagation()}
      {...rest}
    >
      {variant === 'icon' ? (
        <>
          <button
            type="button"
            className={styles.iconButton}
            aria-label={localization.cancel}
            title={localization.cancel}
            onClick={handleCancel}
          >
            <CancelIcon />
          </button>
          {((isCreating && onCreatingRowSave) ||
            (isEditing && onEditingRowSave)) && (
            <button
              type="button"
              className={[styles.iconButton, styles.iconButtonPrimary]
                .filter(Boolean)
                .join(' ')}
              aria-label={localization.save}
              title={localization.save}
              disabled={isSaving}
              onClick={handleSubmitRow}
            >
              {isSaving ? <span className={styles.spinner} /> : <SaveIcon />}
            </button>
          )}
        </>
      ) : (
        <>
          <button
            type="button"
            className={styles.textButton}
            onClick={handleCancel}
          >
            {localization.cancel}
          </button>
          <button
            type="button"
            className={[styles.textButton, styles.textButtonPrimary]
              .filter(Boolean)
              .join(' ')}
            disabled={isSaving}
            onClick={handleSubmitRow}
          >
            {isSaving && <span className={styles.spinner} />}
            {localization.save}
          </button>
        </>
      )}
    </div>
  );
};
