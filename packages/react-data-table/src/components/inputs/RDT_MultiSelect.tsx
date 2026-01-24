import { type ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import {
  Button,
  Dialog,
  DialogTrigger,
  ListBox,
  ListBoxItem,
  Popover,
} from 'react-aria-components';
import styles from './inputs.module.css';

export interface RDT_MultiSelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface RDT_MultiSelectProps {
  'aria-label'?: string;
  className?: string;
  disabled?: boolean;
  label?: ReactNode;
  maxDisplayedChips?: number;
  onChange?: (values: string[]) => void;
  options: RDT_MultiSelectOption[];
  placeholder?: string;
  value?: string[];
}

export const RDT_MultiSelect = ({
  'aria-label': ariaLabel,
  className,
  disabled,
  label,
  maxDisplayedChips = 2,
  onChange,
  options,
  placeholder = 'Select...',
  value = [],
}: RDT_MultiSelectProps) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const selectedValues = useMemo(() => new Set(value), [value]);

  const selectedOptions = useMemo(() => {
    return options.filter((opt) => selectedValues.has(opt.value));
  }, [options, selectedValues]);

  const handleRemoveChip = useCallback(
    (optionValue: string, e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onChange?.(value.filter((v) => v !== optionValue));
    },
    [onChange, value],
  );

  const handleClearAll = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onChange?.([]);
    },
    [onChange],
  );

  const containerClassName = [styles.multiSelectContainer, className]
    .filter(Boolean)
    .join(' ');

  const displayedChips = selectedOptions.slice(0, maxDisplayedChips);
  const remainingCount = selectedOptions.length - maxDisplayedChips;

  return (
    <div className={containerClassName}>
      {label ? <span className={styles.selectLabel}>{label}</span> : null}
      <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
        <Button
          ref={triggerRef}
          className={styles.multiSelectTrigger}
          isDisabled={disabled}
          aria-label={
            ariaLabel ?? (typeof label === 'string' ? label : 'Select options')
          }
        >
          <span className={styles.multiSelectValueContainer}>
            {selectedOptions.length === 0 ? (
              <span className={styles.selectPlaceholder}>{placeholder}</span>
            ) : (
              <>
                {displayedChips.map((option) => (
                  <span key={option.value} className={styles.multiSelectChip}>
                    <span className={styles.multiSelectChipText}>
                      {option.label}
                    </span>
                    <button
                      type="button"
                      className={styles.multiSelectChipRemove}
                      onClick={(e) => handleRemoveChip(option.value, e)}
                      aria-label={`Remove ${option.label}`}
                    >
                      <XIcon />
                    </button>
                  </span>
                ))}
                {remainingCount > 0 && (
                  <span className={styles.multiSelectMore}>
                    +{remainingCount}
                  </span>
                )}
              </>
            )}
          </span>
          <span className={styles.multiSelectActions}>
            {selectedOptions.length > 0 && (
              <button
                type="button"
                className={styles.multiSelectClear}
                onClick={handleClearAll}
                aria-label="Clear all"
              >
                <XIcon />
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
                (typeof label === 'string' ? label : 'Select options')
              }
              selectionMode="multiple"
              selectedKeys={selectedValues}
              onSelectionChange={(keys) => {
                if (keys === 'all') {
                  onChange?.(options.map((o) => o.value));
                } else {
                  onChange?.(Array.from(keys) as string[]);
                }
              }}
              className={styles.selectListBox}
            >
              {options.map((option) => (
                <ListBoxItem
                  key={option.value}
                  id={option.value}
                  className={styles.multiSelectOption}
                  isDisabled={option.disabled}
                  textValue={option.label}
                >
                  {({ isSelected }) => {
                    return (
                      <>
                        <span
                          className={[
                            styles.multiSelectCheckbox,
                            isSelected && styles.multiSelectCheckboxChecked,
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        >
                          {isSelected && <CheckIcon />}
                        </span>
                        <span className={styles.multiSelectOptionLabel}>
                          {option.label}
                        </span>
                      </>
                    );
                  }}
                </ListBoxItem>
              ))}
            </ListBox>
          </Dialog>
        </Popover>
      </DialogTrigger>
    </div>
  );
};

// Icons
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

const XIcon = () => (
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

const CheckIcon = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
