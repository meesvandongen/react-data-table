import {
  type RankingInfo,
  rankItem,
  rankings,
} from '@tanstack/match-sorter-utils';
import { type Row, filterFns } from '@tanstack/react-table';
import { type RDT_RowData } from '../types';

const fuzzy = <TData extends RDT_RowData>(
  row: Row<TData>,
  columnId: string,
  filterValue: number | string,
  addMeta: (item: RankingInfo) => void,
): boolean => {
  const itemRank = rankItem(
    row.getValue<string | number | null>(columnId),
    filterValue as string,
    {
      threshold: rankings.MATCHES,
    },
  );
  addMeta(itemRank);
  return itemRank.passed;
};

fuzzy.autoRemove = (val: any) => !val;

const contains = <TData extends RDT_RowData>(
  row: Row<TData>,
  id: string,
  filterValue: number | string,
): boolean =>
  !!row
    .getValue<number | string | null>(id)
    ?.toString()
    .toLowerCase()
    .trim()
    .includes(filterValue.toString().toLowerCase().trim());

contains.autoRemove = (val: any) => !val;

const startsWith = <TData extends RDT_RowData>(
  row: Row<TData>,
  id: string,
  filterValue: number | string,
): boolean =>
  !!row
    .getValue<number | string | null>(id)
    ?.toString()
    .toLowerCase()
    .trim()
    .startsWith(filterValue.toString().toLowerCase().trim());

startsWith.autoRemove = (val: any) => !val;

const endsWith = <TData extends RDT_RowData>(
  row: Row<TData>,
  id: string,
  filterValue: number | string,
): boolean =>
  !!row
    .getValue<number | string | null>(id)
    ?.toString()
    .toLowerCase()
    .trim()
    .endsWith(filterValue.toString().toLowerCase().trim());

endsWith.autoRemove = (val: any) => !val;

const equals = <TData extends RDT_RowData>(
  row: Row<TData>,
  id: string,
  filterValue: number | string,
): boolean =>
  row.getValue<number | string | null>(id)?.toString().toLowerCase().trim() ===
  filterValue.toString().toLowerCase().trim();

equals.autoRemove = (val: any) => !val;

const notEquals = <TData extends RDT_RowData>(
  row: Row<TData>,
  id: string,
  filterValue: number | string,
): boolean =>
  row.getValue<number | string | null>(id)?.toString().toLowerCase().trim() !==
  filterValue.toString().toLowerCase().trim();

notEquals.autoRemove = (val: any) => !val;

const greaterThan = <TData extends RDT_RowData>(
  row: Row<TData>,
  id: string,
  filterValue: number | string,
): boolean =>
  !isNaN(+filterValue) && !isNaN(+row.getValue<number | string>(id))
    ? +(row.getValue<number | string | null>(id) ?? 0) > +filterValue
    : (row.getValue<number | string | null>(id) ?? '')
        ?.toString()
        .toLowerCase()
        .trim() > filterValue.toString().toLowerCase().trim();

greaterThan.autoRemove = (val: any) => !val;

const greaterThanOrEqualTo = <TData extends RDT_RowData>(
  row: Row<TData>,
  id: string,
  filterValue: number | string,
): boolean => equals(row, id, filterValue) || greaterThan(row, id, filterValue);

greaterThanOrEqualTo.autoRemove = (val: any) => !val;

const lessThan = <TData extends RDT_RowData>(
  row: Row<TData>,
  id: string,
  filterValue: number | string,
): boolean =>
  !isNaN(+filterValue) && !isNaN(+row.getValue<number | string>(id))
    ? +(row.getValue<number | string | null>(id) ?? 0) < +filterValue
    : (row.getValue<number | string | null>(id) ?? '')
        ?.toString()
        .toLowerCase()
        .trim() < filterValue.toString().toLowerCase().trim();

lessThan.autoRemove = (val: any) => !val;

const lessThanOrEqualTo = <TData extends RDT_RowData>(
  row: Row<TData>,
  id: string,
  filterValue: number | string,
): boolean => equals(row, id, filterValue) || lessThan(row, id, filterValue);

lessThanOrEqualTo.autoRemove = (val: any) => !val;

const between = <TData extends RDT_RowData>(
  row: Row<TData>,
  id: string,
  filterValues: [number | string, number | string],
): boolean =>
  ((['', undefined] as any[]).includes(filterValues[0]) ||
    greaterThan(row, id, filterValues[0])) &&
  ((!isNaN(+filterValues[0]) &&
    !isNaN(+filterValues[1]) &&
    +filterValues[0] > +filterValues[1]) ||
    (['', undefined] as any[]).includes(filterValues[1]) ||
    lessThan(row, id, filterValues[1]));

between.autoRemove = (val: any) => !val;

const betweenInclusive = <TData extends RDT_RowData>(
  row: Row<TData>,
  id: string,
  filterValues: [number | string, number | string],
): boolean =>
  ((['', undefined] as any[]).includes(filterValues[0]) ||
    greaterThanOrEqualTo(row, id, filterValues[0])) &&
  ((!isNaN(+filterValues[0]) &&
    !isNaN(+filterValues[1]) &&
    +filterValues[0] > +filterValues[1]) ||
    (['', undefined] as any[]).includes(filterValues[1]) ||
    lessThanOrEqualTo(row, id, filterValues[1]));

betweenInclusive.autoRemove = (val: any) => !val;

const empty = <TData extends RDT_RowData>(
  row: Row<TData>,
  id: string,
  _filterValue: number | string,
): boolean => !row.getValue<number | string | null>(id)?.toString().trim();

empty.autoRemove = (val: any) => !val;

const notEmpty = <TData extends RDT_RowData>(
  row: Row<TData>,
  id: string,
  _filterValue: number | string,
): boolean => !!row.getValue<number | string | null>(id)?.toString().trim();

notEmpty.autoRemove = (val: any) => !val;

// Helper function to normalize a value to a Date object
const toDate = (value: unknown): Date | null => {
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }
  return null;
};

// Helper to get start of day for date-only comparisons
const startOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Date filter: checks if cell date equals filter date (same day)
const dateEquals = <TData extends RDT_RowData>(
  row: Row<TData>,
  id: string,
  filterValue: Date | string,
): boolean => {
  const cellValue = toDate(row.getValue(id));
  const filterDate = toDate(filterValue);
  if (!cellValue || !filterDate) return false;
  return startOfDay(cellValue).getTime() === startOfDay(filterDate).getTime();
};

dateEquals.autoRemove = (val: any) => !val;

// Date filter: checks if cell date is before filter date
const dateBefore = <TData extends RDT_RowData>(
  row: Row<TData>,
  id: string,
  filterValue: Date | string,
): boolean => {
  const cellValue = toDate(row.getValue(id));
  const filterDate = toDate(filterValue);
  if (!cellValue || !filterDate) return false;
  return startOfDay(cellValue).getTime() < startOfDay(filterDate).getTime();
};

dateBefore.autoRemove = (val: any) => !val;

// Date filter: checks if cell date is after filter date
const dateAfter = <TData extends RDT_RowData>(
  row: Row<TData>,
  id: string,
  filterValue: Date | string,
): boolean => {
  const cellValue = toDate(row.getValue(id));
  const filterDate = toDate(filterValue);
  if (!cellValue || !filterDate) return false;
  return startOfDay(cellValue).getTime() > startOfDay(filterDate).getTime();
};

dateAfter.autoRemove = (val: any) => !val;

// Date filter: checks if cell date is between two dates (exclusive)
const dateBetween = <TData extends RDT_RowData>(
  row: Row<TData>,
  id: string,
  filterValues: [Date | string | null, Date | string | null],
): boolean => {
  const cellValue = toDate(row.getValue(id));
  if (!cellValue) return false;
  const cellTime = startOfDay(cellValue).getTime();

  const startDate = filterValues[0] ? toDate(filterValues[0]) : null;
  const endDate = filterValues[1] ? toDate(filterValues[1]) : null;

  const startOk = !startDate || cellTime > startOfDay(startDate).getTime();
  const endOk = !endDate || cellTime < startOfDay(endDate).getTime();

  return startOk && endOk;
};

dateBetween.autoRemove = (val: any) =>
  !val || (Array.isArray(val) && !val[0] && !val[1]);

// Date filter: checks if cell date is between two dates (inclusive)
const dateBetweenInclusive = <TData extends RDT_RowData>(
  row: Row<TData>,
  id: string,
  filterValues: [Date | string | null, Date | string | null],
): boolean => {
  const cellValue = toDate(row.getValue(id));
  if (!cellValue) return false;
  const cellTime = startOfDay(cellValue).getTime();

  const startDate = filterValues[0] ? toDate(filterValues[0]) : null;
  const endDate = filterValues[1] ? toDate(filterValues[1]) : null;

  const startOk = !startDate || cellTime >= startOfDay(startDate).getTime();
  const endOk = !endDate || cellTime <= startOfDay(endDate).getTime();

  return startOk && endOk;
};

dateBetweenInclusive.autoRemove = (val: any) =>
  !val || (Array.isArray(val) && !val[0] && !val[1]);

// Datetime filter: checks if cell datetime equals filter datetime
// (compares full timestamp, not just date)
const datetimeEquals = <TData extends RDT_RowData>(
  row: Row<TData>,
  id: string,
  filterValue: Date | string,
): boolean => {
  const cellValue = toDate(row.getValue(id));
  const filterDate = toDate(filterValue);
  if (!cellValue || !filterDate) return false;
  return cellValue.getTime() === filterDate.getTime();
};

datetimeEquals.autoRemove = (val: any) => !val;

// Datetime filter: checks if cell datetime is between two datetimes (inclusive)
const datetimeBetweenInclusive = <TData extends RDT_RowData>(
  row: Row<TData>,
  id: string,
  filterValues: [Date | string | null, Date | string | null],
): boolean => {
  const cellValue = toDate(row.getValue(id));
  if (!cellValue) return false;
  const cellTime = cellValue.getTime();

  const startDate = filterValues[0] ? toDate(filterValues[0]) : null;
  const endDate = filterValues[1] ? toDate(filterValues[1]) : null;

  const startOk = !startDate || cellTime >= startDate.getTime();
  const endOk = !endDate || cellTime <= endDate.getTime();

  return startOk && endOk;
};

datetimeBetweenInclusive.autoRemove = (val: any) =>
  !val || (Array.isArray(val) && !val[0] && !val[1]);

export const RDT_FilterFns = {
  ...filterFns,
  between,
  betweenInclusive,
  contains,
  dateAfter,
  dateBefore,
  dateBetween,
  dateBetweenInclusive,
  dateEquals,
  datetimeBetweenInclusive,
  datetimeEquals,
  empty,
  endsWith,
  equals,
  fuzzy,
  greaterThan,
  greaterThanOrEqualTo,
  lessThan,
  lessThanOrEqualTo,
  notEmpty,
  notEquals,
  startsWith,
};
