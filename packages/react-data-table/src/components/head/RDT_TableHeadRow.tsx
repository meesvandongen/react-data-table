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
import { RDT_TableHeadCell } from './RDT_TableHeadCell';
import styles from '../table/table.module.css';

export interface RDT_TableHeadRowProps<TData extends RDT_RowData>
  extends HTMLAttributes<HTMLTableRowElement> {
  columnVirtualizer?: RDT_ColumnVirtualizer;
  headerGroup: RDT_HeaderGroup<TData>;
  table: RDT_TableInstance<TData>;
}

export const RDT_TableHeadRow = <TData extends RDT_RowData>({
  columnVirtualizer,
  headerGroup,
  table,
  className,
  ...rest
}: RDT_TableHeadRowProps<TData>) => {
  const {
    options: { layoutMode },
  } = table;

  const { virtualColumns, virtualPaddingLeft, virtualPaddingRight } =
    columnVirtualizer ?? {};

  return (
    <tr
      {...rest}
      className={clsx(
        styles.tableHeadRow,
        layoutMode?.startsWith('grid') && styles.tableLayoutGridRow,
        className,
      )}
    >
      {virtualPaddingLeft ? (
        <th style={{ display: 'flex', width: virtualPaddingLeft }} />
      ) : null}
      {(virtualColumns ?? headerGroup.headers).map(
        (headerOrVirtualHeader, staticColumnIndex) => {
          let header = headerOrVirtualHeader as RDT_Header<TData>;
          if (columnVirtualizer) {
            staticColumnIndex = (headerOrVirtualHeader as RDT_VirtualItem)
              .index;
            header = headerGroup.headers[staticColumnIndex];
          }

          return header ? (
            <RDT_TableHeadCell
              columnVirtualizer={columnVirtualizer}
              header={header}
              key={header.id}
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
