import { type ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import {
  Button,
  Dialog,
  DialogTrigger,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
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
  labelPosition?: 'top' | 'left';
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
  labelPosition = 'top',
  onChange,
  onClear,
  options,
  placeholder = 'Select...',
  showClear = true,
  value,
}: RDT_SelectProps) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value],
  );

  const hasValue = Boolean(value);

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onClear?.();
      onChange?.('');
    },
    [onChange, onClear],
  );

  const handleSelectionChange = useCallback(
    (keys: 'all' | Set<React.Key>) => {
      if (keys !== 'all') {
        const selectedKey = keys.values().next().value;
        if (selectedKey) {
          onChange?.(String(selectedKey));
          setIsOpen(false);
        }
      }
    },
    [onChange],
  );

  const containerClassName = [
    styles.selectContainer,
    labelPosition === 'left' && styles.selectContainerInline,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClassName}>
      {/* @ts-expect-error - React 19 types incompatibility with react-aria-components */}
      {label ? <Label className={styles.selectLabel}>{label}</Label> : null}
      <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
        <Button
          ref={triggerRef}
          className={styles.selectTrigger}
          isDisabled={disabled}
          aria-label={
            ariaLabel ?? (typeof label === 'string' ? label : 'Select option')
          }
        >
          <span className={styles.selectValue}>
            {selectedOption ? (
              <span className={styles.selectValueText}>
                {selectedOption.label}
              </span>
            ) : (
              <span className={styles.selectPlaceholder}>{placeholder}</span>
            )}
          </span>
          <span className={styles.selectActions}>
            {showClear && hasValue && (
              <button
                type="button"
                className={styles.selectClearButton}
                onMouseDown={(e) => e.stopPropagation()}
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
          <Dialog className={styles.multiSelectDialog}>
            <ListBox
              aria-label={
                ariaLabel ??
                (typeof label === 'string' ? label : 'Select option')
              }
              selectionMode="single"
              selectedKeys={
                value !== undefined && value !== null
                  ? new Set([String(value)])
                  : new Set()
              }
              onSelectionChange={handleSelectionChange}
              className={styles.selectListBox}
            >
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
          </Dialog>
        </Popover>
      </DialogTrigger>
    </div>
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
