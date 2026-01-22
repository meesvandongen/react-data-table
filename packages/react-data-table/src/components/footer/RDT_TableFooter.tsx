import { type HTMLAttributes } from 'react';
import clsx from 'clsx';
import { type RDT_RowData, type RDT_TableInstance } from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { RDT_TableFooterRow } from './RDT_TableFooterRow';
import styles from '../table/table.module.css';

export interface RDT_TableFooterProps<TData extends RDT_RowData>
  extends HTMLAttributes<HTMLTableSectionElement> {
  table: RDT_TableInstance<TData>;
}

export const RDT_TableFooter = <TData extends RDT_RowData>({
  table,
  className,
  ...rest
}: RDT_TableFooterProps<TData>) => {
  const {
    getFooterGroups,
    options: { enableStickyFooter, layoutMode, tableFooterProps },
    refs: { tableFooterRef },
  } = table;

  const tfootProps = {
    ...parseFromValuesOrFunc(tableFooterProps, { table }),
    ...rest,
  };

  return (
    <tfoot
      {...tfootProps}
      ref={(ref) => {
        tableFooterRef.current = ref;
        if (typeof tfootProps?.ref === 'function') {
          tfootProps.ref(ref);
        } else if (tfootProps?.ref) {
          (
            tfootProps.ref as React.MutableRefObject<HTMLTableSectionElement | null>
          ).current = ref;
        }
      }}
      className={clsx(
        styles.tableFooter,
        enableStickyFooter && styles.tableFooterSticky,
        layoutMode?.startsWith('grid') && styles.tableLayoutGrid,
        tfootProps?.className,
        className,
      )}
    >
      {getFooterGroups().map((footerGroup) => (
        <RDT_TableFooterRow
          footerGroup={footerGroup}
          key={footerGroup.id}
          table={table}
        />
      ))}
    </tfoot>
  );
};
