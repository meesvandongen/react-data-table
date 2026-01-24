import { useCallback, useEffect, useState } from 'react';
import {
  type RDT_ColumnDef,
  type RDT_RowSelectionState,
  DataTable,
  getRDT_RowSelectionHandler,
  useDataTable,
} from '../../src';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Features/Selection Examples',
};

export default meta;

const columns: RDT_ColumnDef<(typeof data)[0]>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'age',
    header: 'Age',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
];

const data = [...Array(15)].map(() => ({
  address: faker.location.streetAddress(),
  age: faker.number.int(80),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
}));

export const SelectionEnabled = () => (
  <DataTable
    columns={columns}
    data={data}
    enableRowNumbers
    enableRowSelection
  />
);

export const DisableSelectAll = () => (
  <DataTable
    columns={columns}
    data={data}
    enableSelectAll={false}
    enableRowSelection
  />
);

export const SelectionEnabledGrid = () => (
  <DataTable
    columns={columns}
    data={data}
    enableRowNumbers
    enableRowSelection
    layoutMode="grid"
  />
);

export const SelectionEnabledGridNoGrow = () => (
  <DataTable
    columns={columns}
    data={data}
    enableRowNumbers
    enableRowSelection
    layoutMode="grid-no-grow"
  />
);

export const BatchSelectionDisabled = () => (
  <DataTable
    columns={columns}
    data={data}
    enableBatchRowSelection={false}
    enableRowNumbers
    enableRowSelection
  />
);

export const SelectionEnabledConditionally = () => (
  <DataTable
    columns={columns}
    data={data}
    enableRowSelection={(row) => row.original.age >= 21}
  />
);

export const SelectionEnabledConditionallyWithInitial = () => (
  <DataTable
    columns={columns}
    data={data}
    enableRowSelection={(row) => row.original.age >= 21}
    initialState={{
      rowSelection: {
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: true,
      },
    }}
  />
);

export const SelectionEnabledWithRowClick = () => (
  <DataTable
    columns={columns}
    data={data}
    enableRowSelection
    tableRowProps={({ row, staticRowIndex, table }) => ({
      onClick: (event) =>
        getRDT_RowSelectionHandler({ row, staticRowIndex, table })(
          event as any,
        ),
      style: {
        cursor: 'pointer',
        userSelect: 'none',
      },
    })}
  />
);

export const ManualSelection = () => {
  const [rowSelection, setRowSelection] = useState<RDT_RowSelectionState>({});

  console.info(rowSelection);

  return (
    <DataTable
      columns={columns}
      data={data}
      tableRowProps={({ row }) => ({
        onClick: () =>
          setRowSelection((prev) => ({
            ...prev,
            [row.id]: !prev[row.id],
          })),
        'data-selected': rowSelection[row.id] ? true : undefined,
        style: {
          cursor: 'pointer',
        },
      })}
      state={{ rowSelection }}
    />
  );
};

export const SelectAllModeAll = () => (
  <DataTable
    columns={columns}
    data={data}
    enableRowSelection
    selectAllMode="all"
  />
);

export const SelectAllModeAllConditionally = () => (
  <DataTable
    columns={columns}
    data={data}
    enableRowSelection={(row) => row.original.age >= 21}
    selectAllMode="all"
  />
);

export const SelectAllModePage = () => (
  <DataTable
    columns={columns}
    data={data}
    enableRowSelection
    selectAllMode="page"
  />
);

export const SelectAllDisabledCustomHeader = () => (
  <DataTable
    columns={columns}
    data={data}
    displayColumnDefOptions={{
      'rdt-row-select': { header: 'Your Custom Header' },
    }}
    enableRowSelection
    enableSelectAll={false}
  />
);

export const SingleSelectionRadio = () => (
  <DataTable
    columns={columns}
    data={data}
    enableMultiRowSelection={false}
    enableRowSelection
  />
);

export const SingleSelectionRadioWithRowClick = () => (
  <DataTable
    columns={columns}
    data={data}
    enableMultiRowSelection={false}
    enableRowSelection
    tableRowProps={({ row }) => ({
      onClick: row.getToggleSelectedHandler(),
      style: {
        cursor: 'pointer',
      },
    })}
  />
);

export const AlertBannerBottom = () => (
  <DataTable
    columns={columns}
    data={data}
    enableRowSelection
    positionToolbarAlertBanner="bottom"
  />
);

export const AlertBannerHeadOverlay = () => (
  <DataTable
    columns={columns}
    data={data}
    enableRowSelection
    positionToolbarAlertBanner="head-overlay"
  />
);

export const MultiSelectRowWithHoldShift = () => {
  const [prevSelectedStaticRowIndex, setPrevSelectedStaticRowIndex] =
    useState<number>();

  const table = useDataTable({
    columns,
    data,
    enablePagination: false,
    enableRowSelection: (row) => row.original.age > 10,
    enableRowVirtualization: true,
    getRowId: (row) => row.firstName,
    tableContainerProps: { style: { height: '600px' } },
  });

  const handleMultiRowSelectionWithShiftKey = useCallback(
    (opts: { rowId: string; rowIndex: number }) => {
      const { rowId, rowIndex } = opts;
      if (prevSelectedStaticRowIndex === undefined) {
        table.setRowSelection((updater) => {
          return { ...updater, [rowId]: true };
        });
      } else {
        const start = Math.min(prevSelectedStaticRowIndex, rowIndex);
        const end = Math.max(prevSelectedStaticRowIndex, rowIndex);
        handleMultiRowSelection({ end, start });
      }
      setPrevSelectedStaticRowIndex(rowIndex);
    },
    [prevSelectedStaticRowIndex],
  );

  const handleMultiRowSelection = useCallback(
    (opts: { end: number; start: number }) => {
      const { end, start } = opts;
      const rows = table.getRowModel().rows;
      const res: Record<string, boolean> = {};
      for (let i = end; i >= start; i--) {
        if (!rows[i]?.getCanSelect()) {
          continue;
        }
        res[rows[i]['id']] = true;
      }
      table.setRowSelection((updater) => {
        return { ...updater, ...res };
      });
    },
    [],
  );

  useEffect(() => {
    setPrevSelectedStaticRowIndex(undefined);
  }, [table.getState().sorting]);

  return <DataTable table={table} />;
};
