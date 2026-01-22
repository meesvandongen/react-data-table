import { type CSSProperties, type HTMLAttributes, useMemo } from 'react';
import clsx from 'clsx';
import { type RDT_RowData, type RDT_TableInstance } from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { RDT_TableHead } from '../head/RDT_TableHead';
import { RDT_TableBody } from '../body/RDT_TableBody';
import { RDT_TableFooter } from '../footer/RDT_TableFooter';
import styles from './table.module.css';

/** Parse column ID to valid CSS variable name */
const parseCSSVarId = (id: string) => id.replace(/[^a-zA-Z0-9]/g, '_');

export interface RDT_TableProps<TData extends RDT_RowData>
  extends HTMLAttributes<HTMLTableElement> {
  table: RDT_TableInstance<TData>;
}

export const RDT_Table = <TData extends RDT_RowData>({
  table,
  className,
  style,
  ...rest
}: RDT_TableProps<TData>) => {
  const {
    getFlatHeaders,
    getState,
    options: {
      columns,
      enableTableFooter,
      enableTableHead,
      layoutMode,
      renderCaption,
      tableProps,
    },
  } = table;
  const { columnSizing, columnSizingInfo, columnVisibility } = getState();

  const tblProps = {
    ...parseFromValuesOrFunc(tableProps, { table }),
    ...rest,
  };

  const Caption = parseFromValuesOrFunc(renderCaption, { table });

  // Calculate column size CSS variables for dynamic sizing
  const columnSizeVars = useMemo(() => {
    const headers = getFlatHeaders();
    const colSizes: Record<string, number> = {};
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
      const colSize = header.getSize();
      colSizes[`--header-${parseCSSVarId(header.id)}-size`] = colSize;
      colSizes[`--col-${parseCSSVarId(header.column.id)}-size`] = colSize;
    }
    return colSizes;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, columnSizing, columnSizingInfo, columnVisibility]);

  // TODO: Add column virtualizer support
  // const columnVirtualizer = useRDT_ColumnVirtualizer(table);

  const commonTableGroupProps = {
    // columnVirtualizer,
    table,
  };

  return (
    <table
      {...tblProps}
      className={clsx(
        styles.table,
        layoutMode?.startsWith('grid') && styles.tableLayoutGrid,
        tblProps?.className,
        className,
      )}
      style={
        {
          ...columnSizeVars,
          ...tblProps?.style,
          ...style,
        } as CSSProperties
      }
    >
      {!!Caption && <caption>{Caption}</caption>}
      {enableTableHead && <RDT_TableHead {...commonTableGroupProps} />}
      <RDT_TableBody {...commonTableGroupProps} />
      {enableTableFooter && <RDT_TableFooter {...commonTableGroupProps} />}
    </table>
  );
};
