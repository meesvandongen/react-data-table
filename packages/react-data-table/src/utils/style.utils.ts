import { type CSSProperties } from 'react';
import {
  type RDT_Column,
  type RDT_Header,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../types';

/** Parse column ID to valid CSS variable name */
export const parseCSSVarId = (id: string) => id.replace(/[^a-zA-Z0-9]/g, '_');

export interface RDT_CellStylesParams<TData extends RDT_RowData> {
  column: RDT_Column<TData>;
  header?: RDT_Header<TData>;
  table: RDT_TableInstance<TData>;
}

/**
 * Get common cell width styles using CSS variables.
 * This ensures consistent column widths across header, body, and footer cells.
 *
 * Uses CSS variables set at the table level:
 * - `--header-{id}-size` for header cells
 * - `--col-{id}-size` for body cells
 */
export const getRDT_CellWidthStyles = <TData extends RDT_RowData>({
  column,
  header,
  table,
}: RDT_CellStylesParams<TData>): CSSProperties => {
  const { columnDef } = column;
  const {
    options: { layoutMode },
  } = table;

  const varPrefix = header ? 'header' : 'col';
  const varId = parseCSSVarId(header?.id ?? column.id);
  const cssVar = `var(--${varPrefix}-${varId}-size)`;

  const widthStyles: CSSProperties = {
    minWidth: `max(calc(${cssVar} * 1px), ${columnDef.minSize ?? 30}px)`,
    width: `calc(${cssVar} * 1px)`,
  };

  // Handle grid layout modes
  if (layoutMode === 'grid') {
    widthStyles.flex = `${
      [0, false].includes(columnDef.grow!)
        ? 0
        : `var(--${varPrefix}-${varId}-size)`
    } 0 auto`;
  } else if (layoutMode === 'grid-no-grow') {
    widthStyles.flex = `${+(columnDef.grow || 0)} 0 auto`;
  }

  return widthStyles;
};
