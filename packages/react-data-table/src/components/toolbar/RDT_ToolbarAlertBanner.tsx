import { Fragment, useMemo, type HTMLAttributes } from 'react';
import { type RDT_RowData, type RDT_TableInstance } from '../../types';
import { getRDT_SelectAllHandler } from '../../utils/row.utils';
import styles from './toolbar.module.css';

export interface RDT_ToolbarAlertBannerProps<TData extends RDT_RowData>
  extends HTMLAttributes<HTMLDivElement> {
  stackAlertBanner?: boolean;
  table: RDT_TableInstance<TData>;
}

export const RDT_ToolbarAlertBanner = <TData extends RDT_RowData>({
  stackAlertBanner,
  table,
  ...rest
}: RDT_ToolbarAlertBannerProps<TData>) => {
  const {
    getFilteredSelectedRowModel,
    getCoreRowModel,
    getState,
    options: {
      icons: { CloseIcon },
      localization,
      manualPagination,
      positionToolbarAlertBanner,
      renderToolbarAlertBannerContent,
      rowCount,
    },
  } = table;
  const { density, grouping, rowSelection, showAlertBanner } = getState();

  const totalRowCount = rowCount ?? getCoreRowModel().rows.length;
  const filteredRowCount = getFilteredSelectedRowModel().rows.length;

  const selectedRowCount = useMemo(
    () =>
      manualPagination
        ? Object.values(rowSelection).filter(Boolean).length
        : filteredRowCount,
    [rowSelection, totalRowCount, manualPagination, filteredRowCount],
  );

  const selectedAlert =
    selectedRowCount > 0 ? (
      <div className={styles.alertBannerRow}>
        <span>
          {localization.selectedCountOfRowCountRowsSelected
            ?.replace(
              '{selectedCount}',
              selectedRowCount.toLocaleString(localization.language),
            )
            ?.replace(
              '{rowCount}',
              totalRowCount.toLocaleString(localization.language),
            )}
        </span>
        <button
          type="button"
          className={styles.clearSelectionButton}
          onClick={(event) =>
            getRDT_SelectAllHandler({ table })(event, false, true)
          }
        >
          {localization.clearSelection}
        </button>
      </div>
    ) : null;

  const groupedAlert =
    grouping.length > 0 ? (
      <div className={styles.alertBannerRow}>
        <span>{localization.groupedBy} </span>
        {grouping.map((columnId, index) => (
          <Fragment key={`${index}-${columnId}`}>
            {index > 0 && <span>{localization.thenBy}</span>}
            <span className={styles.alertBannerChip}>
              {table.getColumn(columnId).columnDef.header}
              <button
                type="button"
                className={styles.alertBannerChipDelete}
                onClick={() => table.getColumn(columnId).toggleGrouping()}
                aria-label={`Remove ${table.getColumn(columnId).columnDef.header} grouping`}
              >
                <CloseIcon />
              </button>
            </span>
          </Fragment>
        ))}
      </div>
    ) : null;

  const isVisible = showAlertBanner || !!selectedAlert || !!groupedAlert;

  const bannerClassName = [
    styles.alertBanner,
    !isVisible && styles.alertBannerHidden,
  ]
    .filter(Boolean)
    .join(' ');

  // Determine padding based on position and density
  const getPadding = () => {
    if (positionToolbarAlertBanner !== 'head-overlay') {
      return '0.5rem 1rem';
    }
    switch (density) {
      case 'spacious':
        return '0.75rem 1.25rem';
      case 'comfortable':
        return '0.5rem 0.75rem';
      default:
        return '0.25rem 0.5rem';
    }
  };

  // Allow custom render function to override content
  if (renderToolbarAlertBannerContent) {
    const customContent = renderToolbarAlertBannerContent({
      groupedAlert,
      selectedAlert,
      table,
    });

    if (customContent) {
      return (
        <div className={bannerClassName} role="alert" {...rest}>
          {customContent}
        </div>
      );
    }
  }

  return (
    <div className={bannerClassName} role="alert" {...rest}>
      <div
        className={styles.alertBannerContent}
        style={{ padding: getPadding() }}
      >
        {selectedAlert}
        {selectedAlert && groupedAlert && <br />}
        {groupedAlert}
      </div>
    </div>
  );
};
