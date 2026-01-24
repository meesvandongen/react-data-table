import { type HTMLAttributes } from 'react';
import {
  type RDT_Header,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import { getColumnFilterInfo } from '../../utils/column.utils';
import { RDT_FilterCheckbox } from '../inputs/RDT_FilterCheckbox';
import { RDT_FilterDatePicker } from '../inputs/RDT_FilterDatePicker';
import { RDT_FilterDateRangePicker } from '../inputs/RDT_FilterDateRangePicker';
import { RDT_FilterRangeFields } from '../inputs/RDT_FilterRangeFields';
import { RDT_FilterRangeSlider } from '../inputs/RDT_FilterRangeSlider';
import { RDT_FilterTextField } from '../inputs/RDT_FilterTextField';
import { RDT_FilterTimeField } from '../inputs/RDT_FilterTimeField';
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

  const filterVariant = columnDef.filterVariant;

  // Determine which filter component to render
  const renderFilter = () => {
    // Checkbox filter
    if (filterVariant === 'checkbox') {
      return <RDT_FilterCheckbox column={column} table={table} />;
    }

    // Range slider filter
    if (filterVariant === 'range-slider') {
      return <RDT_FilterRangeSlider header={header} table={table} />;
    }

    // Date picker filter
    if (filterVariant === 'date') {
      return <RDT_FilterDatePicker header={header} table={table} />;
    }

    // DateTime picker filter (uses date picker with time granularity)
    if (filterVariant === 'datetime') {
      return (
        <RDT_FilterDatePicker
          header={header}
          table={table}
          granularity="minute"
        />
      );
    }

    // Date range filter
    if (filterVariant === 'date-range') {
      return <RDT_FilterDateRangePicker header={header} table={table} />;
    }

    // Datetime range filter (with time)
    if (filterVariant === 'datetime-range') {
      return (
        <RDT_FilterDateRangePicker
          header={header}
          table={table}
          granularity="minute"
        />
      );
    }

    // Time filter
    if (filterVariant === 'time') {
      return <RDT_FilterTimeField header={header} table={table} />;
    }

    // Time range filter (two time fields)
    if (filterVariant === 'time-range') {
      return <RDT_FilterRangeFields header={header} table={table} isTime />;
    }

    // Range filter (min/max text inputs)
    if (isRangeFilter) {
      return <RDT_FilterRangeFields header={header} table={table} />;
    }

    // Text, select, multi-select, autocomplete filters
    return <RDT_FilterTextField header={header} table={table} />;
  };

  return (
    <div
      {...rest}
      className={[styles.filterContainer, className].filter(Boolean).join(' ')}
    >
      {renderFilter()}
    </div>
  );
};
