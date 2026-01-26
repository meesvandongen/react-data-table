import { type HTMLAttributes } from 'react';
import clsx from 'clsx';
import {
  type RDT_ColumnVirtualizer,
  type RDT_Header,
  type RDT_HeaderGroup,
  type RDT_RowData,
  type RDT_TableInstance,
  type RDT_VirtualItem,
} from '../../types';
import { RDT_TableFooterCell } from './RDT_TableFooterCell';
import styles from '../table/table.module.css';

export interface RDT_TableFooterRowProps<TData extends RDT_RowData>
  extends HTMLAttributes<HTMLTableRowElement> {
  columnVirtualizer?: RDT_ColumnVirtualizer;
  footerGroup: RDT_HeaderGroup<TData>;
  table: RDT_TableInstance<TData>;
}

export const RDT_TableFooterRow = <TData extends RDT_RowData>({
  columnVirtualizer,
  footerGroup,
  table,
  className,
  ...rest
}: RDT_TableFooterRowProps<TData>) => {
  const {
    options: { layoutMode },
  } = table;

  const { virtualColumns, virtualPaddingLeft, virtualPaddingRight } =
    columnVirtualizer ?? {};

  return (
    <tr
      {...rest}
      className={clsx(
        styles.tableFooterRow,
        layoutMode?.startsWith('grid') && styles.tableLayoutGridRow,
        className,
      )}
    >
      {virtualPaddingLeft ? (
        <th style={{ display: 'flex', width: virtualPaddingLeft }} />
      ) : null}
      {(virtualColumns ?? footerGroup.headers).map(
        (footerOrVirtualFooter, staticColumnIndex) => {
          let footer = footerOrVirtualFooter as RDT_Header<TData>;
          if (columnVirtualizer) {
            staticColumnIndex = (footerOrVirtualFooter as RDT_VirtualItem)
              .index;
            footer = footerGroup.headers[staticColumnIndex];
          }

          return footer ? (
            <RDT_TableFooterCell
              footer={footer}
              key={footer.id}
              staticColumnIndex={staticColumnIndex}
              table={table}
            />
          ) : null;
        },
      )}
      {virtualPaddingRight ? (
        <th style={{ display: 'flex', width: virtualPaddingRight }} />
      ) : null}
    </tr>
  );
};
