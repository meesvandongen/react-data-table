import { type ReactNode, useCallback, useMemo, useState } from 'react';
import {
  Button,
  ComboBox,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
} from 'react-aria-components';
import styles from './inputs.module.css';

export interface RDT_AutocompleteOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface RDT_AutocompleteProps {
  'aria-label'?: string;
  className?: string;
  disabled?: boolean;
  freeSolo?: boolean;
  label?: ReactNode;
  onChange?: (value: string) => void;
  onInputChange?: (value: string) => void;
  options: RDT_AutocompleteOption[];
  placeholder?: string;
  value?: string;
}

export const RDT_Autocomplete = ({
  'aria-label': ariaLabel,
  className,
  disabled,
  freeSolo = true,
  label,
  onChange,
  onInputChange,
  options,
  placeholder = 'Search...',
  value = '',
}: RDT_AutocompleteProps) => {
  const [inputValue, setInputValue] = useState(value);

  const filteredOptions = useMemo(() => {
    if (!inputValue) return options;
    const lower = inputValue.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(lower) ||
        opt.value.toLowerCase().includes(lower),
    );
  }, [inputValue, options]);

  const handleInputChange = useCallback(
    (newValue: string) => {
      setInputValue(newValue);
      onInputChange?.(newValue);
      if (freeSolo) {
        onChange?.(newValue);
      }
    },
    [freeSolo, onChange, onInputChange],
  );

  const handleSelectionChange = useCallback(
    (key: React.Key | null) => {
      if (key) {
        const selectedOption = options.find((opt) => opt.value === key);
        if (selectedOption) {
          setInputValue(selectedOption.label);
          onChange?.(selectedOption.value);
        }
      }
    },
    [onChange, options],
  );

  const containerClassName = [styles.autocompleteContainer, className]
    .filter(Boolean)
    .join(' ');

  return (
    <ComboBox
      aria-label={ariaLabel ?? (typeof label === 'string' ? label : 'Search')}
      className={containerClassName}
      inputValue={inputValue}
      isDisabled={disabled}
      allowsCustomValue={freeSolo}
      onInputChange={handleInputChange}
      onSelectionChange={handleSelectionChange}
      menuTrigger="focus"
    >
      {/* @ts-expect-error - React 19 types incompatibility with react-aria-components */}
      {label ? <Label className={styles.selectLabel}>{label}</Label> : null}
      <div className={styles.autocompleteInputWrapper}>
        <Input className={styles.autocompleteInput} placeholder={placeholder} />
        <Button className={styles.autocompleteButton}>
          <ChevronDownIcon />
        </Button>
      </div>
      <Popover className={styles.selectPopover}>
        <ListBox className={styles.selectListBox}>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <ListBoxItem
                key={option.value}
                id={option.value}
                className={styles.selectOption}
                isDisabled={option.disabled}
                textValue={option.label}
              >
                {option.label}
              </ListBoxItem>
            ))
          ) : (
            <ListBoxItem
              id="no-results"
              className={[styles.selectOption, styles.selectOptionEmpty].join(
                ' ',
              )}
              isDisabled
              textValue="No results"
            >
              No results found
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </ComboBox>
  );
};

// Icon
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
