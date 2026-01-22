import { type HTMLAttributes, useEffect, useMemo, useRef } from 'react';
import {
  type RDT_FilterOption,
  type RDT_Header,
  type RDT_InternalFilterOption,
  type RDT_Localization,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import { RDT_ActionMenuItem } from './RDT_ActionMenuItem';
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

export interface RDT_FilterOptionMenuProps<TData extends RDT_RowData>
  extends HTMLAttributes<HTMLDivElement> {
  anchorEl: HTMLElement | null;
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
  style,
  ...rest
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

  const { globalFilterFn } = getState();
  const { column } = header ?? {};
  const { columnDef } = column ?? {};
  const currentFilterValue = column?.getFilterValue();

  const menuRef = useRef<HTMLDivElement>(null);

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

  // Calculate menu position
  const menuPosition = useMemo(() => {
    if (!anchorEl) return null;
    const rect = anchorEl.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const menuWidth = 200;

    let left = rect.right + 4;
    const top = rect.top;

    // Adjust if menu would overflow right edge
    if (left + menuWidth > viewportWidth) {
      left = rect.left - menuWidth - 4;
    }

    return { top, left };
  }, [anchorEl]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!anchorEl) return;

    const handleClickOutside = (event: Event) => {
      const target = event.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setAnchorEl(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [anchorEl, setAnchorEl]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!anchorEl) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAnchorEl(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [anchorEl, setAnchorEl]);

  if (!anchorEl || !menuPosition) return null;

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

    setAnchorEl(null);
    onSelect?.();
  };

  const filterOption =
    !!header && columnDef ? columnDef._filterFn : globalFilterFn;

  const menuItems =
    (header && column && columnDef
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
        })) ??
    internalFilterOptions.map(({ divider, label, option, symbol }, index) => (
      <RDT_ActionMenuItem
        divider={divider}
        icon={
          <span
            className={[
              styles.filterOptionMenuItemCheck,
              option !== filterOption && styles.filterOptionMenuItemCheckHidden,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {symbol}
          </span>
        }
        key={index}
        label={label}
        onClick={() => handleSelectFilterMode(option as RDT_FilterOption)}
        aria-selected={option === filterOption}
        table={table}
      />
    ));

  const menuClassName = [styles.menu, styles.filterOptionMenu, className]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <div
        className={styles.menuBackdrop}
        onClick={() => setAnchorEl(null)}
        aria-hidden="true"
      />
      <div
        ref={menuRef}
        role="menu"
        className={menuClassName}
        style={{
          top: menuPosition.top,
          left: menuPosition.left,
          ...style,
        }}
        {...rest}
      >
        {menuItems}
      </div>
    </>
  );
};
