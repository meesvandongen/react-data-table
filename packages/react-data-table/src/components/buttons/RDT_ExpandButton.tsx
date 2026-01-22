import { type ButtonHTMLAttributes, type MouseEvent } from 'react';
import {
  type RDT_Row,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import styles from './buttons.module.css';

export interface RDT_ExpandButtonProps<TData extends RDT_RowData>
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  row: RDT_Row<TData>;
  staticRowIndex?: number;
  table: RDT_TableInstance<TData>;
}

export const RDT_ExpandButton = <TData extends RDT_RowData>({
  row,
  staticRowIndex,
  table,
  className,
  style,
  ...rest
}: RDT_ExpandButtonProps<TData>) => {
  const {
    getState,
    options: {
      icons: { ExpandMoreIcon },
      localization,
      positionExpandColumn,
      renderDetailPanel,
    },
  } = table;
  const { density } = getState();

  const canExpand = row.getCanExpand();
  const isExpanded = row.getIsExpanded();
  const detailPanel = !!renderDetailPanel?.({ row, table });

  const handleToggleExpand = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    row.toggleExpanded();
  };

  const buttonStyle: React.CSSProperties = {
    height: density === 'compact' ? '1.75rem' : '2.25rem',
    width: density === 'compact' ? '1.75rem' : '2.25rem',
    opacity: !canExpand && !detailPanel ? 0.3 : 1,
    marginLeft:
      positionExpandColumn !== 'last' ? `${row.depth * 16}px` : undefined,
    marginRight:
      positionExpandColumn === 'last' ? `${row.depth * 16}px` : undefined,
    ...style,
  };

  const iconStyle: React.CSSProperties = {
    transform: `rotate(${
      !canExpand && !renderDetailPanel
        ? positionExpandColumn === 'last'
          ? 90
          : -90
        : isExpanded
          ? -180
          : 0
    }deg)`,
    transition: 'transform 150ms',
  };

  return (
    <button
      type="button"
      className={[styles.iconButton, className].filter(Boolean).join(' ')}
      style={buttonStyle}
      aria-label={isExpanded ? localization.collapse : localization.expand}
      title={isExpanded ? localization.collapse : localization.expand}
      disabled={!canExpand && !detailPanel}
      onClick={handleToggleExpand}
      {...rest}
    >
      <ExpandMoreIcon style={iconStyle} />
    </button>
  );
};
