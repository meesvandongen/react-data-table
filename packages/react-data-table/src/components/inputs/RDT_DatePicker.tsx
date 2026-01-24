import { type ReactNode, useCallback, useMemo } from 'react';
import { CalendarDate, type DateValue } from '@internationalized/date';
import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  DateInput,
  DatePicker,
  DateSegment,
  Dialog,
  Group,
  Heading,
  Label,
  Popover,
} from 'react-aria-components';
import styles from './inputs.module.css';

export interface RDT_DatePickerProps {
  'aria-label'?: string;
  className?: string;
  disabled?: boolean;
  granularity?: 'day' | 'hour' | 'minute' | 'second';
  label?: ReactNode;
  maxValue?: Date;
  minValue?: Date;
  onChange?: (value: Date | null) => void;
  value?: Date | null;
}

export const RDT_DatePicker = ({
  'aria-label': ariaLabel,
  className,
  disabled,
  granularity = 'day',
  label,
  maxValue,
  minValue,
  onChange,
  value,
}: RDT_DatePickerProps) => {
  const dateValue = useMemo((): DateValue | null => {
    if (!value) return null;
    try {
      return new CalendarDate(
        value.getFullYear(),
        value.getMonth() + 1,
        value.getDate(),
      );
    } catch {
      return null;
    }
  }, [value]);

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
    (newValue: DateValue | null) => {
      if (!newValue) {
        onChange?.(null);
        return;
      }
      try {
        const date = new Date(newValue.year, newValue.month - 1, newValue.day);
        onChange?.(date);
      } catch {
        onChange?.(null);
      }
    },
    [onChange],
  );

  const containerClassName = [styles.datePickerContainer, className]
    .filter(Boolean)
    .join(' ');

  return (
    <DatePicker
      aria-label={ariaLabel ?? (typeof label === 'string' ? label : 'Date')}
      className={containerClassName}
      granularity={granularity}
      isDisabled={disabled}
      maxValue={maxDateValue}
      minValue={minDateValue}
      onChange={handleChange}
      value={dateValue}
    >
      {/* @ts-expect-error - React 19 types incompatibility with react-aria-components */}
      {label ? <Label className={styles.selectLabel}>{label}</Label> : null}
      <Group className={styles.datePickerGroup}>
        <DateInput className={styles.datePickerInput}>
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
      <Popover className={styles.datePickerPopover}>
        <Dialog className={styles.datePickerDialog}>
          <Calendar className={styles.calendar}>
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
                    className={({ isSelected, isDisabled, isFocusVisible }) =>
                      [
                        styles.calendarCell,
                        isSelected && styles.calendarCellSelected,
                        isDisabled && styles.calendarCellDisabled,
                        isFocusVisible && styles.calendarCellFocused,
                      ]
                        .filter(Boolean)
                        .join(' ')
                    }
                  />
                )}
              </CalendarGridBody>
            </CalendarGrid>
          </Calendar>
        </Dialog>
      </Popover>
    </DatePicker>
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
