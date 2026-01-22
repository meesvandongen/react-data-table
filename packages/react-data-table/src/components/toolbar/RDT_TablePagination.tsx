import { type ChangeEvent, type HTMLAttributes } from 'react';
import { type RDT_RowData, type RDT_TableInstance } from '../../types';
import styles from './toolbar.module.css';

const defaultRowsPerPage = [5, 10, 15, 20, 25, 30, 50, 100];

export interface RDT_TablePaginationProps<TData extends RDT_RowData>
  extends HTMLAttributes<HTMLDivElement> {
  position?: 'bottom' | 'top';
  table: RDT_TableInstance<TData>;
  disabled?: boolean;
  rowsPerPageOptions?: { label: string; value: number }[] | number[];
  showRowsPerPage?: boolean;
  showFirstLastButtons?: boolean;
}

export const RDT_TablePagination = <TData extends RDT_RowData>({
  position = 'bottom',
  table,
  disabled = false,
  rowsPerPageOptions = defaultRowsPerPage,
  showRowsPerPage = true,
  showFirstLastButtons,
  ...rest
}: RDT_TablePaginationProps<TData>) => {
  const {
    getState,
    options: {
      enableToolbarInternalActions,
      icons: {
        ChevronLeftIcon,
        ChevronRightIcon,
        ChevronLeftPipeIcon,
        ChevronRightPipeIcon,
      },
      id,
      localization,
      paginationDisplayMode,
    },
  } = table;

  const {
    pagination: { pageIndex = 0, pageSize = 10 },
  } = getState();

  const totalRowCount = table.getRowCount();
  const numberOfPages = table.getPageCount();
  const showFirstLastPageButtons = showFirstLastButtons ?? numberOfPages > 2;
  const firstRowIndex = pageIndex * pageSize;
  const lastRowIndex = Math.min(pageIndex * pageSize + pageSize, totalRowCount);

  const disableBack = pageIndex <= 0 || disabled;
  const disableNext = lastRowIndex >= totalRowCount || disabled;

  const handlePageSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    table.setPageSize(Number(event.target.value));
  };

  const paginationClassName = [
    styles.pagination,
    position === 'top' && enableToolbarInternalActions && styles.paginationTop,
  ]
    .filter(Boolean)
    .join(' ');

  // Generate page numbers for "pages" display mode
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const showPages = 5; // Number of page buttons to show

    if (numberOfPages <= showPages + 2) {
      // Show all pages if there aren't many
      for (let i = 0; i < numberOfPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(0);

      if (pageIndex > 2) {
        pages.push('ellipsis');
      }

      // Show pages around current page
      const start = Math.max(1, pageIndex - 1);
      const end = Math.min(numberOfPages - 2, pageIndex + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (pageIndex < numberOfPages - 3) {
        pages.push('ellipsis');
      }

      // Always show last page
      pages.push(numberOfPages - 1);
    }

    return pages;
  };

  return (
    <div className={paginationClassName} {...rest}>
      {showRowsPerPage && (
        <div className={styles.paginationRowsPerPage}>
          <label
            htmlFor={`rdt-rows-per-page-${id}`}
            className={styles.paginationRowsPerPageLabel}
          >
            {localization.rowsPerPage}
          </label>
          <select
            id={`rdt-rows-per-page-${id}`}
            className={styles.paginationRowsPerPageSelect}
            value={pageSize}
            onChange={handlePageSizeChange}
            disabled={disabled}
            aria-label={localization.rowsPerPage}
          >
            {rowsPerPageOptions.map((option) => {
              const value = typeof option === 'number' ? option : option.value;
              const label =
                typeof option === 'number' ? `${option}` : option.label;
              return (
                <option key={value} value={value}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>
      )}

      {paginationDisplayMode === 'pages' ? (
        <div className={styles.paginationPages}>
          {showFirstLastPageButtons && (
            <button
              type="button"
              className={styles.paginationButton}
              onClick={() => table.firstPage()}
              disabled={disableBack}
              aria-label={localization.goToFirstPage}
              title={localization.goToFirstPage}
            >
              <ChevronLeftPipeIcon />
            </button>
          )}
          <button
            type="button"
            className={styles.paginationButton}
            onClick={() => table.previousPage()}
            disabled={disableBack}
            aria-label={localization.goToPreviousPage}
            title={localization.goToPreviousPage}
          >
            <ChevronLeftIcon />
          </button>

          {getPageNumbers().map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className={styles.paginationPageButton}
                >
                  ...
                </span>
              );
            }
            return (
              <button
                key={page}
                type="button"
                className={`${styles.paginationPageButton} ${
                  page === pageIndex ? styles.paginationPageButtonActive : ''
                }`}
                onClick={() => table.setPageIndex(page)}
                disabled={disabled}
                aria-label={`Go to page ${page + 1}`}
                aria-current={page === pageIndex ? 'page' : undefined}
              >
                {page + 1}
              </button>
            );
          })}

          <button
            type="button"
            className={styles.paginationButton}
            onClick={() => table.nextPage()}
            disabled={disableNext}
            aria-label={localization.goToNextPage}
            title={localization.goToNextPage}
          >
            <ChevronRightIcon />
          </button>
          {showFirstLastPageButtons && (
            <button
              type="button"
              className={styles.paginationButton}
              onClick={() => table.lastPage()}
              disabled={disableNext}
              aria-label={localization.goToLastPage}
              title={localization.goToLastPage}
            >
              <ChevronRightPipeIcon />
            </button>
          )}
        </div>
      ) : paginationDisplayMode === 'default' ? (
        <>
          <span className={styles.paginationInfo}>
            {lastRowIndex === 0
              ? 0
              : (firstRowIndex + 1).toLocaleString(localization.language)}
            -{lastRowIndex.toLocaleString(localization.language)}{' '}
            {localization.of}{' '}
            {totalRowCount.toLocaleString(localization.language)}
          </span>
          <div className={styles.paginationButtons}>
            {showFirstLastPageButtons && (
              <button
                type="button"
                className={styles.paginationButton}
                onClick={() => table.firstPage()}
                disabled={disableBack}
                aria-label={localization.goToFirstPage}
                title={localization.goToFirstPage}
              >
                <ChevronLeftPipeIcon />
              </button>
            )}
            <button
              type="button"
              className={styles.paginationButton}
              onClick={() => table.previousPage()}
              disabled={disableBack}
              aria-label={localization.goToPreviousPage}
              title={localization.goToPreviousPage}
            >
              <ChevronLeftIcon />
            </button>
            <button
              type="button"
              className={styles.paginationButton}
              onClick={() => table.nextPage()}
              disabled={disableNext}
              aria-label={localization.goToNextPage}
              title={localization.goToNextPage}
            >
              <ChevronRightIcon />
            </button>
            {showFirstLastPageButtons && (
              <button
                type="button"
                className={styles.paginationButton}
                onClick={() => table.lastPage()}
                disabled={disableNext}
                aria-label={localization.goToLastPage}
                title={localization.goToLastPage}
              >
                <ChevronRightPipeIcon />
              </button>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};
