import { type ButtonHTMLAttributes } from 'react';
import { type RDT_RowData, type RDT_TableInstance } from '../../types';
import styles from './buttons.module.css';

export interface RDT_ExpandAllButtonProps<TData extends RDT_RowData>
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  table: RDT_TableInstance<TData>;
}

export const RDT_ExpandAllButton = <TData extends RDT_RowData>({
  table,
  className,
  style,
  ...rest
}: RDT_ExpandAllButtonProps<TData>) => {
  const {
    getCanSomeRowsExpand,
    getIsAllRowsExpanded,
    getIsSomeRowsExpanded,
    getState,
    options: {
      icons: { KeyboardDoubleArrowDownIcon },
      localization,
      renderDetailPanel,
    },
    toggleAllRowsExpanded,
  } = table;

  const { density, isLoading } = getState();
  const isAllRowsExpanded = getIsAllRowsExpanded();
  const canExpand = renderDetailPanel || getCanSomeRowsExpand();

  const buttonStyle: React.CSSProperties = {
    height: density === 'compact' ? '1.75rem' : '2.25rem',
    width: density === 'compact' ? '1.75rem' : '2.25rem',
    marginTop: density !== 'compact' ? '-0.25rem' : undefined,
    ...style,
  };

  const iconStyle: React.CSSProperties = {
    transform: `rotate(${
      isAllRowsExpanded ? -180 : getIsSomeRowsExpanded() ? -90 : 0
    }deg)`,
    transition: 'transform 150ms',
  };

  const label = isAllRowsExpanded
    ? localization.collapseAll
    : localization.expandAll;

  return (
    <button
      type="button"
      className={[styles.iconButton, className].filter(Boolean).join(' ')}
      style={buttonStyle}
      aria-label={label}
      title={label}
      disabled={isLoading || !canExpand}
      onClick={() => toggleAllRowsExpanded(!isAllRowsExpanded)}
      {...rest}
    >
      <KeyboardDoubleArrowDownIcon style={iconStyle} />
    </button>
  );
};
