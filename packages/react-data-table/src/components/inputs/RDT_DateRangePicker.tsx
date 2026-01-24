import { type ReactNode, useCallback, useMemo } from 'react';
import {
  CalendarDate,
  CalendarDateTime,
  type DateValue,
} from '@internationalized/date';
import {
  Button,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  DateInput,
  DateRangePicker,
  DateSegment,
  Dialog,
  Group,
  Heading,
  Label,
  Popover,
  RangeCalendar,
  type DateRange,
} from 'react-aria-components';
import styles from './inputs.module.css';

export interface RDT_DateRangePickerProps {
  'aria-label'?: string;
  className?: string;
  disabled?: boolean;
  granularity?: 'day' | 'hour' | 'minute' | 'second';
  label?: ReactNode;
  maxValue?: Date;
  minValue?: Date;
  onChange?: (value: { start: Date | null; end: Date | null }) => void;
  value?: { start: Date | null; end: Date | null };
}

export const RDT_DateRangePicker = ({
  'aria-label': ariaLabel,
  className,
  disabled,
  granularity = 'day',
  label,
  maxValue,
  minValue,
  onChange,
  value,
}: RDT_DateRangePickerProps) => {
  const includesTime = granularity !== 'day';

  const dateRangeValue = useMemo((): DateRange | null => {
    if (!value?.start && !value?.end) return null;
    try {
      let start: DateValue | null = null;
      let end: DateValue | null = null;

      if (value.start) {
        if (includesTime) {
          start = new CalendarDateTime(
            value.start.getFullYear(),
            value.start.getMonth() + 1,
            value.start.getDate(),
            value.start.getHours(),
            value.start.getMinutes(),
            value.start.getSeconds(),
          );
        } else {
          start = new CalendarDate(
            value.start.getFullYear(),
            value.start.getMonth() + 1,
            value.start.getDate(),
          );
        }
      }

      if (value.end) {
        if (includesTime) {
          end = new CalendarDateTime(
            value.end.getFullYear(),
            value.end.getMonth() + 1,
            value.end.getDate(),
            value.end.getHours(),
            value.end.getMinutes(),
            value.end.getSeconds(),
          );
        } else {
          end = new CalendarDate(
            value.end.getFullYear(),
            value.end.getMonth() + 1,
            value.end.getDate(),
          );
        }
      }

      if (!start || !end) return null;
      return { start, end };
    } catch {
      return null;
    }
  }, [value, includesTime]);

  const minDateValue = useMemo((): DateValue | undefined => {
    if (!minValue) return undefined;
    try {
      return new CalendarDate(
        minValue.getFullYear(),
        minValue.getMonth() + 1,
        minValue.getDate(),
      );
    } catch {
      return undefined;
    }
  }, [minValue]);

  const maxDateValue = useMemo((): DateValue | undefined => {
    if (!maxValue) return undefined;
    try {
      return new CalendarDate(
        maxValue.getFullYear(),
        maxValue.getMonth() + 1,
        maxValue.getDate(),
      );
    } catch {
      return undefined;
    }
  }, [maxValue]);

  const handleChange = useCallback(
    (newValue: DateRange | null) => {
      if (!newValue) {
        onChange?.({ start: null, end: null });
        return;
      }
      try {
        let start: Date | null = null;
        let end: Date | null = null;

        if (newValue.start) {
          if ('hour' in newValue.start) {
            start = new Date(
              newValue.start.year,
              newValue.start.month - 1,
              newValue.start.day,
              (newValue.start as CalendarDateTime).hour,
              (newValue.start as CalendarDateTime).minute,
              (newValue.start as CalendarDateTime).second,
            );
          } else {
            start = new Date(
              newValue.start.year,
              newValue.start.month - 1,
              newValue.start.day,
            );
          }
        }

        if (newValue.end) {
          if ('hour' in newValue.end) {
            end = new Date(
              newValue.end.year,
              newValue.end.month - 1,
              newValue.end.day,
              (newValue.end as CalendarDateTime).hour,
              (newValue.end as CalendarDateTime).minute,
              (newValue.end as CalendarDateTime).second,
            );
          } else {
            end = new Date(
              newValue.end.year,
              newValue.end.month - 1,
              newValue.end.day,
            );
          }
        }

        onChange?.({ start, end });
      } catch {
        onChange?.({ start: null, end: null });
      }
    },
    [onChange],
  );

  const containerClassName = [styles.dateRangePickerContainer, className]
    .filter(Boolean)
    .join(' ');

  return (
    <DateRangePicker
      aria-label={
        ariaLabel ?? (typeof label === 'string' ? label : 'Date range')
      }
      className={containerClassName}
      granularity={granularity}
      isDisabled={disabled}
      maxValue={maxDateValue}
      minValue={minDateValue}
      onChange={handleChange}
      value={dateRangeValue}
    >
      {/* @ts-expect-error - React 19 types incompatibility with react-aria-components */}
      {label ? <Label className={styles.selectLabel}>{label}</Label> : null}
      <Group className={styles.dateRangePickerGroup}>
        <DateInput slot="start" className={styles.dateRangeInput}>
          {(segment) => (
            <DateSegment
              segment={segment}
              className={[
                styles.dateSegment,
                segment.isPlaceholder && styles.dateSegmentPlaceholder,
              ]
                .filter(Boolean)
                .join(' ')}
            />
          )}
        </DateInput>
        <span className={styles.dateRangeSeparator}>–</span>
        <DateInput slot="end" className={styles.dateRangeInput}>
          {(segment) => (
            <DateSegment
              segment={segment}
              className={[
                styles.dateSegment,
                segment.isPlaceholder && styles.dateSegmentPlaceholder,
              ]
                .filter(Boolean)
                .join(' ')}
            />
          )}
        </DateInput>
        <Button className={styles.datePickerButton}>
          <CalendarIcon />
        </Button>
      </Group>
      <Popover className={styles.dateRangePickerPopover}>
        <Dialog className={styles.datePickerDialog}>
          <RangeCalendar className={styles.calendar}>
            <header className={styles.calendarHeader}>
              <Button slot="previous" className={styles.calendarNavButton}>
                <ChevronLeftIcon />
              </Button>
              <Heading className={styles.calendarHeading} />
              <Button slot="next" className={styles.calendarNavButton}>
                <ChevronRightIcon />
              </Button>
            </header>
            <CalendarGrid className={styles.calendarGrid}>
              <CalendarGridHeader className={styles.calendarGridHeader}>
                {(day) => (
                  <CalendarHeaderCell className={styles.calendarHeaderCell}>
                    {day}
                  </CalendarHeaderCell>
                )}
              </CalendarGridHeader>
              <CalendarGridBody className={styles.calendarGridBody}>
                {(date) => (
                  <CalendarCell
                    date={date}
                    className={({
                      isSelected,
                      isDisabled,
                      isFocusVisible,
                      isSelectionStart,
                      isSelectionEnd,
                    }) =>
                      [
                        styles.calendarCell,
                        isSelected && styles.calendarCellSelected,
                        isDisabled && styles.calendarCellDisabled,
                        isFocusVisible && styles.calendarCellFocused,
                        isSelectionStart && styles.calendarCellRangeStart,
                        isSelectionEnd && styles.calendarCellRangeEnd,
                      ]
                        .filter(Boolean)
                        .join(' ')
                    }
                  />
                )}
              </CalendarGridBody>
            </CalendarGrid>
          </RangeCalendar>
        </Dialog>
      </Popover>
    </DateRangePicker>
  );
};

// Icons
const CalendarIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);
