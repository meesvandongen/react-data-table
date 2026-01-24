import { useMemo } from 'react';
import { Menu, MenuItem, MenuTrigger, Popover } from 'react-aria-components';
import clsx from 'clsx';
import {
  type RDT_FilterOption,
  type RDT_Header,
  type RDT_InternalFilterOption,
  type RDT_Localization,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import styles from './menus.module.css';

/**
 * Internal filter options configuration
 */
export const rdtFilterOptions = (
  localization: RDT_Localization,
): RDT_InternalFilterOption[] => [
  {
    divider: false,
    label: localization.filterFuzzy,
    option: 'fuzzy',
    symbol: '≈',
  },
  {
    divider: false,
    label: localization.filterContains,
    option: 'contains',
    symbol: '*',
  },
  {
    divider: false,
    label: localization.filterStartsWith,
    option: 'startsWith',
    symbol: 'a',
  },
  {
    divider: true,
    label: localization.filterEndsWith,
    option: 'endsWith',
    symbol: 'z',
  },
  {
    divider: false,
    label: localization.filterEquals,
    option: 'equals',
    symbol: '=',
  },
  {
    divider: true,
    label: localization.filterNotEquals,
    option: 'notEquals',
    symbol: '≠',
  },
  {
    divider: false,
    label: localization.filterBetween,
    option: 'between',
    symbol: '⇿',
  },
  {
    divider: true,
    label: localization.filterBetweenInclusive,
    option: 'betweenInclusive',
    symbol: '⬌',
  },
  {
    divider: false,
    label: localization.filterGreaterThan,
    option: 'greaterThan',
    symbol: '>',
  },
  {
    divider: false,
    label: localization.filterGreaterThanOrEqualTo,
    option: 'greaterThanOrEqualTo',
    symbol: '≥',
  },
  {
    divider: false,
    label: localization.filterLessThan,
    option: 'lessThan',
    symbol: '<',
  },
  {
    divider: true,
    label: localization.filterLessThanOrEqualTo,
    option: 'lessThanOrEqualTo',
    symbol: '≤',
  },
  {
    divider: false,
    label: localization.filterEmpty,
    option: 'empty',
    symbol: '∅',
  },
  {
    divider: false,
    label: localization.filterNotEmpty,
    option: 'notEmpty',
    symbol: '!∅',
  },
];

const rangeModes = ['between', 'betweenInclusive', 'inNumberRange'];
const emptyModes = ['empty', 'notEmpty'];
const arrModes = ['arrIncludesSome', 'arrIncludesAll', 'arrIncludes'];
const rangeVariants = ['range-slider', 'date-range', 'datetime-range', 'range'];

export interface RDT_FilterOptionMenuProps<TData extends RDT_RowData> {
  anchorEl: HTMLElement | null;
  className?: string;
  header?: RDT_Header<TData>;
  onSelect?: () => void;
  setAnchorEl: (anchorEl: HTMLElement | null) => void;
  setFilterValue?: (filterValue: any) => void;
  table: RDT_TableInstance<TData>;
}

export const RDT_FilterOptionMenu = <TData extends RDT_RowData>({
  anchorEl,
  header,
  onSelect,
  setAnchorEl,
  setFilterValue,
  table,
  className,
}: RDT_FilterOptionMenuProps<TData>) => {
  const {
    getState,
    options: {
      columnFilterModeOptions,
      globalFilterModeOptions,
      localization,
      renderColumnFilterModeMenuItems,
      renderGlobalFilterModeMenuItems,
    },
    setColumnFilterFns,
    setGlobalFilterFn,
  } = table;

  const { density, globalFilterFn } = getState();
  const { column } = header ?? {};
  const { columnDef } = column ?? {};
  const currentFilterValue = column?.getFilterValue();
  const isDense = density === 'compact';

  let allowedColumnFilterOptions =
    columnDef?.columnFilterModeOptions ?? columnFilterModeOptions;

  if (rangeVariants.includes(columnDef?.filterVariant as string)) {
    allowedColumnFilterOptions = [
      ...rangeModes,
      ...(allowedColumnFilterOptions ?? []),
    ].filter((option) => rangeModes.includes(option as string));
  }

  const internalFilterOptions = useMemo(
    () =>
      rdtFilterOptions(localization).filter((filterOption) =>
        columnDef
          ? allowedColumnFilterOptions === undefined ||
            allowedColumnFilterOptions?.includes(filterOption.option)
          : (!globalFilterModeOptions ||
              globalFilterModeOptions.includes(
                filterOption.option as RDT_FilterOption,
              )) &&
            ['contains', 'fuzzy', 'startsWith'].includes(filterOption.option),
      ),
    [
      localization,
      columnDef,
      allowedColumnFilterOptions,
      globalFilterModeOptions,
    ],
  );

  if (!anchorEl) return null;

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectFilterMode = (option: RDT_FilterOption) => {
    const prevFilterMode = columnDef?._filterFn ?? '';

    if (!header || !column) {
      // Global filter mode
      setGlobalFilterFn(option);
    } else if (option !== prevFilterMode) {
      // Column filter mode
      setColumnFilterFns((prev: Record<string, any>) => ({
        ...prev,
        [header.id]: option,
      }));

      // Reset filter value and/or perform new filter render
      if (emptyModes.includes(option as string)) {
        // Will now be empty/notEmpty filter mode
        if (
          currentFilterValue !== ' ' &&
          !emptyModes.includes(prevFilterMode as string)
        ) {
          column.setFilterValue(' ');
        } else if (currentFilterValue) {
          column.setFilterValue(currentFilterValue);
        }
      } else if (
        columnDef?.filterVariant === 'multi-select' ||
        arrModes.includes(option as string)
      ) {
        // Will now be array filter mode
        if (
          currentFilterValue instanceof String ||
          (currentFilterValue as Array<any>)?.length
        ) {
          column.setFilterValue([]);
          setFilterValue?.([]);
        } else if (currentFilterValue) {
          column.setFilterValue(currentFilterValue);
        }
      } else if (
        columnDef?.filterVariant?.includes('range') ||
        rangeModes.includes(option as string)
      ) {
        // Will now be range filter mode
        if (
          !Array.isArray(currentFilterValue) ||
          (!(currentFilterValue as Array<any>)?.every((v) => v === '') &&
            !rangeModes.includes(prevFilterMode as string))
        ) {
          column.setFilterValue(['', '']);
          setFilterValue?.('');
        } else {
          column.setFilterValue(currentFilterValue);
        }
      } else {
        // Will now be single value filter mode
        if (Array.isArray(currentFilterValue)) {
          column.setFilterValue('');
          setFilterValue?.('');
        } else if (
          currentFilterValue === ' ' &&
          emptyModes.includes(prevFilterMode as string)
        ) {
          column.setFilterValue(undefined);
        } else {
          column.setFilterValue(currentFilterValue);
        }
      }
    }

    handleClose();
    onSelect?.();
  };

  const filterOption =
    !!header && columnDef ? columnDef._filterFn : globalFilterFn;

  const customMenuItems =
    header && column && columnDef
      ? (columnDef.renderColumnFilterModeMenuItems?.({
          column: column as any,
          internalFilterOptions,
          onSelectFilterMode: handleSelectFilterMode,
          table,
        }) ??
        renderColumnFilterModeMenuItems?.({
          column: column as any,
          internalFilterOptions,
          onSelectFilterMode: handleSelectFilterMode,
          table,
        }))
      : renderGlobalFilterModeMenuItems?.({
          internalFilterOptions,
          onSelectFilterMode: handleSelectFilterMode,
          table,
        });

  return (
    <MenuTrigger isOpen={!!anchorEl} onOpenChange={() => {}}>
      {/* Hidden trigger */}
      <button style={{ display: 'none' }} aria-hidden>
        trigger
      </button>
      <Popover
        isOpen={!!anchorEl}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleClose();
        }}
        triggerRef={{ current: anchorEl }}
        placement="end top"
        className={clsx(styles.menu, styles.filterOptionMenu, className)}
      >
        <Menu
          onAction={() => {}}
          aria-label={localization.filterMode ?? 'Filter mode'}
          className={styles.menuInner}
        >
          {customMenuItems ? (
            <>{customMenuItems}</>
          ) : (
            <>
              {internalFilterOptions.map(
                ({ divider, label, option, symbol }, index) => (
                  <MenuItem
                    key={index}
                    className={clsx(
                      styles.menuItem,
                      isDense && styles.menuItemDense,
                      divider && styles.menuItemDivider,
                    )}
                    onAction={() =>
                      handleSelectFilterMode(option as RDT_FilterOption)
                    }
                    aria-selected={option === filterOption}
                  >
                    <span className={styles.menuItemContent}>
                      <span
                        className={clsx(
                          styles.filterOptionMenuItemCheck,
                          option !== filterOption &&
                            styles.filterOptionMenuItemCheckHidden,
                        )}
                      >
                        {symbol}
                      </span>
                      <span className={styles.menuItemLabel}>{label}</span>
                    </span>
                  </MenuItem>
                ),
              )}
            </>
          )}
        </Menu>
      </Popover>
    </MenuTrigger>
  );
};
