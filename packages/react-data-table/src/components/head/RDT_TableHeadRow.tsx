import { type HTMLAttributes } from 'react';
import clsx from 'clsx';
import {
  type RDT_HeaderGroup,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import { RDT_TableHeadCell } from './RDT_TableHeadCell';
import styles from '../table/table.module.css';

export interface RDT_TableHeadRowProps<TData extends RDT_RowData>
  extends HTMLAttributes<HTMLTableRowElement> {
  headerGroup: RDT_HeaderGroup<TData>;
  table: RDT_TableInstance<TData>;
}

export const RDT_TableHeadRow = <TData extends RDT_RowData>({
  headerGroup,
  table,
  className,
  ...rest
}: RDT_TableHeadRowProps<TData>) => {
  const {
    options: { layoutMode },
  } = table;

  return (
    <tr
      {...rest}
      className={clsx(
        styles.tableHeadRow,
        layoutMode?.startsWith('grid') && styles.tableLayoutGrid,
        className,
      )}
    >
      {headerGroup.headers.map((header) => (
        <RDT_TableHeadCell header={header} key={header.id} table={table} />
      ))}
    </tr>
  );
};
