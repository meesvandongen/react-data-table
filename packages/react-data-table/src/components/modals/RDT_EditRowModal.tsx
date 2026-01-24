import { type ReactNode } from 'react';
import {
  Dialog,
  DialogTrigger,
  Modal,
  ModalOverlay,
} from 'react-aria-components';
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

export interface RDT_EditRowModalProps<TData extends RDT_RowData> {
  className?: string;
  onClose?: () => void;
  open: boolean;
  table: RDT_TableInstance<TData>;
}

export const RDT_EditRowModal = <TData extends RDT_RowData>({
  onClose,
  open,
  table,
  className,
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

  const modalProps = {
    ...parseFromValuesOrFunc(editRowModalProps, { row, table }),
    ...(creatingRow &&
      parseFromValuesOrFunc(createRowModalProps, { row, table })),
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

  if (!row) {
    return null;
  }

  const internalEditComponents = row
    .getAllCells()
    .filter((cell) => cell.column.columnDef.columnDefType === 'data')
    .map((cell) => (
      <RDT_EditCellTextField cell={cell as any} key={cell.id} table={table} />
    ));

  const customContent: ReactNode =
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
    <DialogTrigger>
      <ModalOverlay
        className={styles.modalBackdrop}
        isDismissable
        isOpen={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            handleClose();
          }
        }}
      >
        <Modal
          className={clsx(
            styles.modal,
            styles.modalSmall,
            styles.editRowModal,
            modalProps?.className,
            className,
          )}
        >
          <Dialog
            aria-labelledby="edit-row-modal-title"
            className={styles.modalDialog}
          >
            {customContent ? (
              <>{customContent}</>
            ) : (
              <>
                <div className={styles.modalHeader}>
                  <h2
                    id="edit-row-modal-title"
                    className={clsx(
                      styles.modalTitle,
                      styles.editRowModalTitle,
                    )}
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
                  <RDT_EditActionButtons
                    row={row}
                    table={table}
                    variant="text"
                  />
                </div>
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
};
