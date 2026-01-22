import { type HTMLAttributes } from 'react';
import {
  type RDT_Header,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import { getColumnFilterInfo } from '../../utils/column.utils';
import { RDT_FilterCheckbox } from '../inputs/RDT_FilterCheckbox';
import { RDT_FilterRangeFields } from '../inputs/RDT_FilterRangeFields';
import { RDT_FilterRangeSlider } from '../inputs/RDT_FilterRangeSlider';
import { RDT_FilterTextField } from '../inputs/RDT_FilterTextField';
import styles from '../table/table.module.css';

export interface RDT_TableHeadCellFilterContainerProps<
  TData extends RDT_RowData,
> extends HTMLAttributes<HTMLDivElement> {
  header: RDT_Header<TData>;
  table: RDT_TableInstance<TData>;
}

export const RDT_TableHeadCellFilterContainer = <TData extends RDT_RowData>({
  header,
  table,
  className,
  ...rest
}: RDT_TableHeadCellFilterContainerProps<TData>) => {
  const {
    getState,
    options: { columnFilterDisplayMode },
  } = table;
  const { showColumnFilters } = getState();
  const { column } = header;
  const { columnDef } = column;
  const { isRangeFilter } = getColumnFilterInfo({ header, table });

  const isVisible = showColumnFilters || columnFilterDisplayMode === 'popover';

  if (!isVisible) {
    return null;
  }

  return (
    <div
      {...rest}
      className={[styles.filterContainer, className].filter(Boolean).join(' ')}
    >
      {columnDef.filterVariant === 'checkbox' ? (
        <RDT_FilterCheckbox column={column} table={table} />
      ) : columnDef.filterVariant === 'range-slider' ? (
        <RDT_FilterRangeSlider header={header} table={table} />
      ) : isRangeFilter ? (
        <RDT_FilterRangeFields header={header} table={table} />
      ) : (
        <RDT_FilterTextField header={header} table={table} />
      )}
    </div>
  );
};
