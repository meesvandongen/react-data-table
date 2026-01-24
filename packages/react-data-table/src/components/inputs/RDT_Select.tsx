import { type ReactNode, useRef } from 'react';
import {
  Button,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
} from 'react-aria-components';
import styles from './inputs.module.css';

export interface RDT_SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface RDT_SelectProps {
  'aria-label'?: string;
  className?: string;
  disabled?: boolean;
  label?: ReactNode;
  onChange?: (value: string) => void;
  onClear?: () => void;
  options: RDT_SelectOption[];
  placeholder?: string;
  showClear?: boolean;
  value?: string;
}

export const RDT_Select = ({
  'aria-label': ariaLabel,
  className,
  disabled,
  label,
  onChange,
  onClear,
  options,
  placeholder = 'Select...',
  showClear = true,
  value,
}: RDT_SelectProps) => {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selectedKey = value ?? null;
  const hasValue = Boolean(value);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onClear?.();
    onChange?.('');
  };

  const containerClassName = [styles.selectContainer, className]
    .filter(Boolean)
    .join(' ');

  return (
    <Select
      aria-label={ariaLabel ?? (typeof label === 'string' ? label : undefined)}
      className={containerClassName}
      isDisabled={disabled}
      onSelectionChange={(key) => {
        if (key) {
          onChange?.(key as string);
        }
      }}
      selectedKey={selectedKey}
    >
      {/* @ts-expect-error - React 19 types incompatibility with react-aria-components */}
      {label ? <Label className={styles.selectLabel}>{label}</Label> : null}
      <Button ref={triggerRef} className={styles.selectTrigger}>
        <SelectValue className={styles.selectValue}>
          {({ selectedText }) =>
            selectedText ? (
              <span className={styles.selectValueText}>{selectedText}</span>
            ) : (
              <span className={styles.selectPlaceholder}>{placeholder}</span>
            )
          }
        </SelectValue>
        <span className={styles.selectActions}>
          {showClear && hasValue && (
            <button
              type="button"
              className={styles.selectClearButton}
              onClick={handleClear}
              aria-label="Clear selection"
            >
              <CloseIcon />
            </button>
          )}
          <span className={styles.selectIcon}>
            <ChevronDownIcon />
          </span>
        </span>
      </Button>
      <Popover className={styles.selectPopover}>
        <ListBox className={styles.selectListBox}>
          {options.map((option) => (
            <ListBoxItem
              key={option.value}
              id={option.value}
              className={styles.selectOption}
              isDisabled={option.disabled}
              textValue={option.label}
            >
              {option.label}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </Select>
  );
};

// Simple chevron icon
const ChevronDownIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);
