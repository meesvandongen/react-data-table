import { type ThHTMLAttributes } from 'react';
import clsx from 'clsx';
import {
  type RDT_Header,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import { flexRender } from '../../utils/tanstack.helpers';
import styles from '../table/table.module.css';

export interface RDT_TableFooterCellProps<TData extends RDT_RowData>
  extends ThHTMLAttributes<HTMLTableCellElement> {
  footer: RDT_Header<TData>;
  table: RDT_TableInstance<TData>;
}

export const RDT_TableFooterCell = <TData extends RDT_RowData>({
  footer,
  table,
  className,
  style,
  ...rest
}: RDT_TableFooterCellProps<TData>) => {
  const { column } = footer;
  const { columnDef } = column;

  const isPinned = column.getIsPinned();

  // Get the pinned position offset
  const pinnedOffset =
    isPinned === 'left'
      ? column.getStart('left')
      : isPinned === 'right'
        ? column.getAfter('right')
        : undefined;

  return (
    <th
      {...rest}
      colSpan={footer.colSpan}
      className={clsx(
        styles.tableFooterCell,
        isPinned && styles.tableHeadCellPinned, // reuse head pinned styles
        isPinned === 'left' && styles.tableHeadCellPinnedLeft,
        isPinned === 'right' && styles.tableHeadCellPinnedRight,
        className,
      )}
      style={{
        width: footer.getSize(),
        minWidth: columnDef.minSize,
        maxWidth: columnDef.maxSize,
        ...(isPinned && {
          [isPinned === 'left'
            ? '--rdt-pinned-left-offset'
            : '--rdt-pinned-right-offset']: `${pinnedOffset}px`,
        }),
        ...style,
      }}
    >
      {footer.isPlaceholder
        ? null
        : flexRender(columnDef.Footer ?? (columnDef.footer as any), {
            column,
            footer,
            table,
          })}
    </th>
  );
};
