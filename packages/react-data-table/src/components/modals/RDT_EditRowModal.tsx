import { type HTMLAttributes, useEffect, useRef } from 'react';
import clsx from 'clsx';
import {
  type RDT_Row,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { RDT_EditActionButtons } from '../buttons/RDT_EditActionButtons';
import { RDT_EditCellTextField } from '../inputs/RDT_EditCellTextField';
import styles from './modals.module.css';

export interface RDT_EditRowModalProps<TData extends RDT_RowData>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onClose'> {
  onClose?: () => void;
  open: boolean;
  table: RDT_TableInstance<TData>;
}

export const RDT_EditRowModal = <TData extends RDT_RowData>({
  onClose,
  open,
  table,
  className,
  ...rest
}: RDT_EditRowModalProps<TData>) => {
  const {
    getState,
    options: {
      localization,
      createRowModalProps,
      editRowModalProps,
      onCreatingRowCancel,
      onEditingRowCancel,
      renderCreateRowModalContent,
      renderEditRowModalContent,
    },
    setCreatingRow,
    setEditingRow,
  } = table;
  const { creatingRow, editingRow } = getState();
  const row = (creatingRow ?? editingRow) as RDT_Row<TData>;

  const modalRef = useRef<HTMLDivElement>(null);

  const modalProps = {
    ...parseFromValuesOrFunc(editRowModalProps, { row, table }),
    ...(creatingRow &&
      parseFromValuesOrFunc(createRowModalProps, { row, table })),
    ...rest,
  };

  const handleClose = () => {
    if (creatingRow) {
      onCreatingRowCancel?.({ row, table });
      setCreatingRow(null);
    } else {
      onEditingRowCancel?.({ row, table });
      setEditingRow(null);
    }
    // Reset values cache
    if (row) {
      // @ts-expect-error - _valuesCache is internal
      row._valuesCache = {};
    }
    onClose?.();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        handleClose();
      }
    };
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      // Focus the modal for accessibility
      modalRef.current?.focus();
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open || !row) {
    return null;
  }

  const internalEditComponents = row
    .getAllCells()
    .filter((cell) => cell.column.columnDef.columnDefType === 'data')
    .map((cell) => (
      <RDT_EditCellTextField cell={cell as any} key={cell.id} table={table} />
    ));

  const customContent =
    (creatingRow &&
      renderCreateRowModalContent?.({
        internalEditComponents,
        row,
        table,
      })) ||
    renderEditRowModalContent?.({
      internalEditComponents,
      row,
      table,
    });

  return (
    <div
      className={styles.modalBackdrop}
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-row-modal-title"
        tabIndex={-1}
        {...modalProps}
        className={clsx(
          styles.modal,
          styles.modalSmall,
          styles.editRowModal,
          modalProps?.className,
          className,
        )}
      >
        {customContent ?? (
          <>
            <div className={styles.modalHeader}>
              <h2
                id="edit-row-modal-title"
                className={clsx(styles.modalTitle, styles.editRowModalTitle)}
              >
                {creatingRow
                  ? (localization.create ?? 'Create')
                  : (localization.edit ?? 'Edit')}
              </h2>
              <button
                type="button"
                className={styles.modalCloseButton}
                onClick={handleClose}
                aria-label={localization.close ?? 'Close'}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className={styles.modalContent}>
              <form
                className={styles.modalForm}
                onSubmit={(e) => e.preventDefault()}
              >
                <div className={styles.editRowModalFields}>
                  {internalEditComponents}
                </div>
              </form>
            </div>
            <div className={styles.modalActions}>
              <RDT_EditActionButtons row={row} table={table} variant="text" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
