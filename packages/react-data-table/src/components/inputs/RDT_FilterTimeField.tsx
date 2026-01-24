import { useCallback, useEffect, useState } from 'react';
import {
  type RDT_Header,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import { RDT_TimeField } from './RDT_TimeField';

export interface RDT_FilterTimeFieldProps<TData extends RDT_RowData> {
  header: RDT_Header<TData>;
  table: RDT_TableInstance<TData>;
}

export const RDT_FilterTimeField = <TData extends RDT_RowData>({
  header,
  table,
}: RDT_FilterTimeFieldProps<TData>) => {
  const {
    options: { localization },
  } = table;
  const { column } = header;
  const { columnDef } = column;

  const parseTimeValue = (
    value: unknown,
  ): { hour: number; minute: number; second: number } | null => {
    if (!value) return null;
    if (
      typeof value === 'object' &&
      value !== null &&
      'hour' in value &&
      'minute' in value
    ) {
      return value as { hour: number; minute: number; second: number };
    }
    if (typeof value === 'string') {
      const parts = value.split(':');
      if (parts.length >= 2) {
        return {
          hour: parseInt(parts[0], 10) || 0,
          minute: parseInt(parts[1], 10) || 0,
          second: parseInt(parts[2], 10) || 0,
        };
      }
    }
    return null;
  };

  const [filterValue, setFilterValue] = useState<{
    hour: number;
    minute: number;
    second: number;
  } | null>(() => parseTimeValue(column.getFilterValue()));

  const handleChange = useCallback(
    (newValue: { hour: number; minute: number; second: number } | null) => {
      setFilterValue(newValue);
      column.setFilterValue(newValue ?? undefined);
    },
    [column],
  );

  // Sync with external filter value changes
  useEffect(() => {
    const value = column.getFilterValue();
    if (value === undefined) {
      setFilterValue(null);
    } else {
      setFilterValue(parseTimeValue(value));
    }
  }, [column.getFilterValue()]);

  // Custom filter component
  if (columnDef.Filter) {
    return <>{columnDef.Filter?.({ column, header, table })}</>;
  }

  const placeholder = localization.filterByColumn?.replace(
    '{column}',
    String(columnDef.header),
  );

  return (
    <RDT_TimeField
      aria-label={placeholder}
      onChange={handleChange}
      value={filterValue}
    />
  );
};
