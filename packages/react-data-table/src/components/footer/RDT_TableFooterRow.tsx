import { type HTMLAttributes } from 'react';
import clsx from 'clsx';
import {
  type RDT_HeaderGroup,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import { RDT_TableFooterCell } from './RDT_TableFooterCell';
import styles from '../table/table.module.css';

export interface RDT_TableFooterRowProps<TData extends RDT_RowData>
  extends HTMLAttributes<HTMLTableRowElement> {
  footerGroup: RDT_HeaderGroup<TData>;
  table: RDT_TableInstance<TData>;
}

export const RDT_TableFooterRow = <TData extends RDT_RowData>({
  footerGroup,
  table,
  className,
  ...rest
}: RDT_TableFooterRowProps<TData>) => {
  const {
    options: { layoutMode },
  } = table;

  return (
    <tr
      {...rest}
      className={clsx(
        styles.tableFooterRow,
        layoutMode?.startsWith('grid') && styles.tableLayoutGrid,
        className,
      )}
    >
      {footerGroup.headers.map((header) => (
        <RDT_TableFooterCell footer={header} key={header.id} table={table} />
      ))}
    </tr>
  );
};
