import {
  type RDT_DefinedTableOptions,
  type RDT_DisplayColumnIds,
  type RDT_Localization,
  type RDT_RowData,
  type RDT_StatefulTableOptions,
} from '../types';
import { getAllLeafColumnDefs, getColumnId } from './column.utils';

export function defaultDisplayColumnProps<TData extends RDT_RowData>({
  header,
  id,
  size,
  tableOptions,
}: {
  header?: keyof RDT_Localization;
  id: RDT_DisplayColumnIds;
  size: number;
  tableOptions: RDT_DefinedTableOptions<TData>;
}) {
  const { defaultDisplayColumn, displayColumnDefOptions, localization } =
    tableOptions;
  return {
    ...defaultDisplayColumn,
    header: header ? localization[header]! : '',
    size,
    ...displayColumnDefOptions?.[id],
    id,
  } as const;
}

export const showRowPinningColumn = <TData extends RDT_RowData>(
  tableOptions: RDT_StatefulTableOptions<TData>,
): boolean => {
  const { enableRowPinning, rowPinningDisplayMode } = tableOptions;
  return !!(enableRowPinning && !rowPinningDisplayMode?.startsWith('select'));
};

export const showRowDragColumn = <TData extends RDT_RowData>(
  tableOptions: RDT_StatefulTableOptions<TData>,
): boolean => {
  const { enableRowDragging, enableRowOrdering } = tableOptions;
  return !!(enableRowDragging || enableRowOrdering);
};

export const showRowExpandColumn = <TData extends RDT_RowData>(
  tableOptions: RDT_StatefulTableOptions<TData>,
): boolean => {
  const {
    enableExpanding,
    enableGrouping,
    renderDetailPanel,
    state: { grouping },
  } = tableOptions;
  return !!(
    enableExpanding ||
    (enableGrouping && grouping?.length) ||
    renderDetailPanel
  );
};

export const showRowActionsColumn = <TData extends RDT_RowData>(
  tableOptions: RDT_StatefulTableOptions<TData>,
): boolean => {
  const {
    createDisplayMode,
    editDisplayMode,
    enableEditing,
    enableRowActions,
    state: { creatingRow },
  } = tableOptions;
  return !!(
    enableRowActions ||
    (creatingRow && createDisplayMode === 'row') ||
    (enableEditing && ['modal', 'row'].includes(editDisplayMode ?? ''))
  );
};

export const showRowSelectionColumn = <TData extends RDT_RowData>(
  tableOptions: RDT_StatefulTableOptions<TData>,
): boolean => !!tableOptions.enableRowSelection;

export const showRowNumbersColumn = <TData extends RDT_RowData>(
  tableOptions: RDT_StatefulTableOptions<TData>,
): boolean => !!tableOptions.enableRowNumbers;

export const showRowSpacerColumn = <TData extends RDT_RowData>(
  tableOptions: RDT_StatefulTableOptions<TData>,
): boolean => tableOptions.layoutMode === 'grid-no-grow';

export const getLeadingDisplayColumnIds = <TData extends RDT_RowData>(
  tableOptions: RDT_StatefulTableOptions<TData>,
) =>
  [
    showRowPinningColumn(tableOptions) && 'rdt-row-pin',
    showRowDragColumn(tableOptions) && 'rdt-row-drag',
    tableOptions.positionActionsColumn === 'first' &&
      showRowActionsColumn(tableOptions) &&
      'rdt-row-actions',
    tableOptions.positionExpandColumn === 'first' &&
      showRowExpandColumn(tableOptions) &&
      'rdt-row-expand',
    showRowSelectionColumn(tableOptions) && 'rdt-row-select',
    showRowNumbersColumn(tableOptions) && 'rdt-row-numbers',
  ].filter(Boolean) as RDT_DisplayColumnIds[];

export const getTrailingDisplayColumnIds = <TData extends RDT_RowData>(
  tableOptions: RDT_StatefulTableOptions<TData>,
) =>
  [
    tableOptions.positionActionsColumn === 'last' &&
      showRowActionsColumn(tableOptions) &&
      'rdt-row-actions',
    tableOptions.positionExpandColumn === 'last' &&
      showRowExpandColumn(tableOptions) &&
      'rdt-row-expand',
    showRowSpacerColumn(tableOptions) && 'rdt-row-spacer',
  ].filter(Boolean) as RDT_DisplayColumnIds[];

export const getDefaultColumnOrderIds = <TData extends RDT_RowData>(
  tableOptions: RDT_StatefulTableOptions<TData>,
  reset = false,
) => {
  const {
    state: { columnOrder: currentColumnOrderIds = [] },
  } = tableOptions;

  const leadingDisplayColIds: string[] =
    getLeadingDisplayColumnIds(tableOptions);
  const trailingDisplayColIds: string[] =
    getTrailingDisplayColumnIds(tableOptions);

  const defaultColumnDefIds = getAllLeafColumnDefs(tableOptions.columns).map(
    (columnDef) => getColumnId(columnDef),
  );

  let allLeafColumnDefIds = reset
    ? defaultColumnDefIds
    : Array.from(new Set([...currentColumnOrderIds, ...defaultColumnDefIds]));

  allLeafColumnDefIds = allLeafColumnDefIds.filter(
    (colId) =>
      !leadingDisplayColIds.includes(colId) &&
      !trailingDisplayColIds.includes(colId),
  );

  return [
    ...leadingDisplayColIds,
    ...allLeafColumnDefIds,
    ...trailingDisplayColIds,
  ];
};
