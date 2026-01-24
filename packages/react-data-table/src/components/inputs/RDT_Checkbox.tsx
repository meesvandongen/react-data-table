import {
  type InputHTMLAttributes,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import clsx from 'clsx';
import styles from './inputs.module.css';

export interface RDT_CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  indeterminate?: boolean;
  compact?: boolean;
}

export const RDT_Checkbox = forwardRef<HTMLInputElement, RDT_CheckboxProps>(
  ({ indeterminate, compact, className, ...rest }, ref) => {
    const internalRef = useRef<HTMLInputElement>(null);

    // Expose the internal ref to the parent
    useImperativeHandle(ref, () => internalRef.current!, []);

    // Handle indeterminate state (can only be set via JavaScript)
    useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = !!indeterminate;
      }
    }, [indeterminate]);

    return (
      <input
        ref={internalRef}
        type="checkbox"
        className={clsx(
          styles.checkbox,
          compact && styles.checkboxCompact,
          className,
        )}
        {...rest}
      />
    );
  },
);

RDT_Checkbox.displayName = 'RDT_Checkbox';
