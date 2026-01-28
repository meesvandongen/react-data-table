import { type HTMLAttributes, useState } from 'react';
import {
  type RDT_Header,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import { getColumnFilterInfo } from '../../utils/column.utils';
import { RDT_FilterOptionMenu } from '../menus/RDT_FilterOptionMenu';
import { RDT_FilterTextField } from './RDT_FilterTextField';
import { RDT_FilterTimeField } from './RDT_FilterTimeField';
import styles from './inputs.module.css';

export interface RDT_FilterRangeFieldsProps<
  TData extends RDT_RowData,
> extends HTMLAttributes<HTMLDivElement> {
  header: RDT_Header<TData>;
  isTime?: boolean;
  table: RDT_TableInstance<TData>;
}

export const RDT_FilterRangeFields = <TData extends RDT_RowData>({
  header,
  isTime,
  table,
  className,
  ...rest
}: RDT_FilterRangeFieldsProps<TData>) => {
  const {
    options: {
      enableColumnFilterModes,
      icons: { FilterListIcon },
      localization,
    },
  } = table;

  const { column } = header;
  const { columnDef } = column;

  const { allowedColumnFilterOptions, currentFilterOption } =
    getColumnFilterInfo({ header, table });

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleFilterMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const showChangeModeButton = !!(
    enableColumnFilterModes &&
    columnDef.enableColumnFilterModes !== false &&
    (allowedColumnFilterOptions === undefined ||
      !!allowedColumnFilterOptions?.length)
  );

  return (
    <>
      <div
        {...rest}
        className={[styles.filterContainer, className]
          .filter(Boolean)
          .join(' ')}
      >
        {showChangeModeButton && (
          <button
            type="button"
            className={styles.filterModeButton}
            onClick={handleFilterMenuOpen}
            aria-label={localization.changeFilterMode}
            title={localization.changeFilterMode}
          >
            <FilterListIcon />
          </button>
        )}

        <div className={styles.filterRangeContainer}>
          {isTime ? (
            // For time range, render two time fields
            <>
              <RDT_FilterTimeField header={header} table={table} />
              <RDT_FilterTimeField header={header} table={table} />
            </>
          ) : (
            // For other ranges, render two text fields
            [0, 1].map((rangeFilterIndex) => (
              <RDT_FilterTextField
                header={header}
                key={rangeFilterIndex}
                rangeFilterIndex={rangeFilterIndex}
                table={table}
                hideFilterModeUI
              />
            ))
          )}
        </div>
      </div>

      {showChangeModeButton && (
        <span className={styles.filterHelperText}>
          {localization.filterMode.replace(
            '{filterType}',
            localization[
              `filter${
                currentFilterOption?.charAt(0)?.toUpperCase() +
                currentFilterOption?.slice(1)
              }` as keyof typeof localization
            ] as string,
          )}
        </span>
      )}

      <RDT_FilterOptionMenu
        anchorEl={anchorEl}
        header={header}
        setAnchorEl={setAnchorEl}
        setFilterValue={() => {}}
        table={table}
      />
    </>
  );
};
