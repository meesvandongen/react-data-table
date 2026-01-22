import { type HTMLAttributes } from 'react';
import clsx from 'clsx';
import { type RDT_RowData, type RDT_TableInstance } from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { RDT_TableHeadRow } from './RDT_TableHeadRow';
import styles from '../table/table.module.css';

export interface RDT_TableHeadProps<TData extends RDT_RowData>
  extends HTMLAttributes<HTMLTableSectionElement> {
  table: RDT_TableInstance<TData>;
}

export const RDT_TableHead = <TData extends RDT_RowData>({
  table,
  className,
  ...rest
}: RDT_TableHeadProps<TData>) => {
  const {
    getHeaderGroups,
    getState,
    options: { enableStickyHeader, layoutMode, tableHeadProps },
    refs: { tableHeadRef },
  } = table;
  const { isFullScreen } = getState();

  const theadProps = {
    ...parseFromValuesOrFunc(tableHeadProps, { table }),
    ...rest,
  };

  const stickyHeader = enableStickyHeader || isFullScreen;

  return (
    <thead
      {...theadProps}
      ref={(ref) => {
        tableHeadRef.current = ref;
        if (typeof theadProps?.ref === 'function') {
          theadProps.ref(ref);
        } else if (theadProps?.ref) {
          (
            theadProps.ref as React.MutableRefObject<HTMLTableSectionElement | null>
          ).current = ref;
        }
      }}
      className={clsx(
        styles.tableHead,
        stickyHeader && styles.tableHeadSticky,
        layoutMode?.startsWith('grid') && styles.tableLayoutGrid,
        theadProps?.className,
        className,
      )}
    >
      {getHeaderGroups().map((headerGroup) => (
        <RDT_TableHeadRow
          headerGroup={headerGroup}
          key={headerGroup.id}
          table={table}
        />
      ))}
    </thead>
  );
};
