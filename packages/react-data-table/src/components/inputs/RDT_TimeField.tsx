import { type ReactNode, useCallback, useMemo } from 'react';
import { Time } from '@internationalized/date';
import {
  DateInput,
  DateSegment,
  Label,
  TimeField,
  type TimeValue,
} from 'react-aria-components';
import styles from './inputs.module.css';

export interface RDT_TimeFieldProps {
  'aria-label'?: string;
  className?: string;
  disabled?: boolean;
  granularity?: 'hour' | 'minute' | 'second';
  hourCycle?: 12 | 24;
  label?: ReactNode;
  onChange?: (
    value: { hour: number; minute: number; second: number } | null,
  ) => void;
  value?: { hour: number; minute: number; second?: number } | null;
}

export const RDT_TimeField = ({
  'aria-label': ariaLabel,
  className,
  disabled,
  granularity = 'minute',
  hourCycle = 24,
  label,
  onChange,
  value,
}: RDT_TimeFieldProps) => {
  const timeValue = useMemo((): TimeValue | null => {
    if (!value) return null;
    try {
      return new Time(value.hour, value.minute, value.second ?? 0);
    } catch {
      return null;
    }
  }, [value]);

  const handleChange = useCallback(
    (newValue: TimeValue | null) => {
      if (!newValue) {
        onChange?.(null);
        return;
      }
      try {
        onChange?.({
          hour: newValue.hour,
          minute: newValue.minute,
          second: newValue.second,
        });
      } catch {
        onChange?.(null);
      }
    },
    [onChange],
  );

  const containerClassName = [styles.timeFieldContainer, className]
    .filter(Boolean)
    .join(' ');

  return (
    <TimeField
      aria-label={ariaLabel ?? (typeof label === 'string' ? label : 'Time')}
      className={containerClassName}
      granularity={granularity}
      hourCycle={hourCycle}
      isDisabled={disabled}
      onChange={handleChange}
      value={timeValue}
    >
      {/* @ts-expect-error - React 19 types incompatibility with react-aria-components */}
      {label ? <Label className={styles.selectLabel}>{label}</Label> : null}
      <DateInput className={styles.timeFieldInput}>
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
    </TimeField>
  );
};
