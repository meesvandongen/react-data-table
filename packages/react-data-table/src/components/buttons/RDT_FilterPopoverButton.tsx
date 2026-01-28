import { type ButtonHTMLAttributes, type MouseEvent, useState } from 'react';
import { Popover } from 'react-aria-components';
import {
  type RDT_Header,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import { RDT_TableHeadCellFilterContainer } from '../head/RDT_TableHeadCellFilterContainer';
import styles from './buttons.module.css';

export interface RDT_FilterPopoverButtonProps<
  TData extends RDT_RowData,
> extends ButtonHTMLAttributes<HTMLButtonElement> {
  header: RDT_Header<TData>;
  table: RDT_TableInstance<TData>;
}

export const RDT_FilterPopoverButton = <TData extends RDT_RowData>({
  header,
  table,
  className,
  ...rest
}: RDT_FilterPopoverButtonProps<TData>) => {
  const { column } = header;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpenPopover = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const buttonClassName = [
    styles.iconButton,
    styles.columnActionButton,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <button
        type="button"
        aria-label="Filter"
        title="Filter"
        className={buttonClassName}
        onClick={handleOpenPopover}
        {...rest}
      >
        <table.options.icons.FilterAltIcon />
      </button>
      <Popover
        isOpen={!!anchorEl}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setAnchorEl(null);
          } else {
            queueMicrotask(() => {
              table.refs.filterInputRefs.current?.[`${column.id}-0`]?.focus?.();
            });
          }
        }}
        triggerRef={{ current: anchorEl }}
        placement="bottom start"
        className={styles.filterPopover}
      >
        <div className={styles.filterPopoverContent}>
          <RDT_TableHeadCellFilterContainer header={header} table={table} />
        </div>
      </Popover>
    </>
  );
};
