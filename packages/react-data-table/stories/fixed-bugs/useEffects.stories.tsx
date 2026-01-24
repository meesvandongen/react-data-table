import { useEffect, useMemo, useState } from 'react';
import {
  type RDT_ColumnDef,
  type RDT_ColumnFiltersState,
  RDT_PaginationState,
  DataTable,
} from '../../src';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';
import { Updater } from '@tanstack/react-table';

const meta: Meta = {
  title: 'Fixed Bugs/useEffects',
};

export default meta;

interface Person {
  address: string;
  age: number;
  firstName: string;
  gender: string;
  lastName: string;
  phoneNumber: string;
  state: string;
}

const data: Person[] = [...Array(100)].map(() => ({
  address: faker.location.streetAddress(),
  age: faker.number.int(100),
  firstName: faker.person.firstName(),
  gender: Math.random() < 0.9 ? faker.person.sex() : faker.person.gender(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
}));

export const FilterModesRefetch = () => {
  const [columnFilters, setColumnFilters] = useState<RDT_ColumnFiltersState>(
    [],
  );

  useEffect(() => {
    console.log('refetch', columnFilters);
  }, [columnFilters]);

  const columns: RDT_ColumnDef<Person>[] = [
    {
      accessorKey: 'firstName',
      header: 'First Name',
    },
    {
      accessorKey: 'lastName',
      header: 'Last Name',
    },
    {
      accessorKey: 'address',
      header: 'Address',
    },
    {
      accessorKey: 'state',
      header: 'State',
    },
    {
      accessorKey: 'phoneNumber',
      header: 'Phone Number',
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      enableColumnFilterModes
      initialState={{ showColumnFilters: true }}
      onColumnFiltersChange={setColumnFilters}
      state={{ columnFilters }}
    />
  );
};

export const FilterOptionsAsync = () => {
  const [stateFilterOptions, setStateFilterOptions] = useState<string[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setStateFilterOptions(['CA', 'NY', 'TX']);
    }, 2000);
  }, []);

  const columns = useMemo<RDT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
      {
        accessorKey: 'state',
        filterSelectOptions: stateFilterOptions,
        filterVariant: 'select',
        header: 'State',
      },
      {
        accessorKey: 'phoneNumber',
        header: 'Phone Number',
      },
    ],
    [stateFilterOptions],
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      enableColumnFilterModes
      initialState={{ showColumnFilters: true }}
    />
  );
};

export const EditOptionsAsync = () => {
  const [stateEditOptions, setStateEditOptions] = useState<string[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setStateEditOptions(['CA', 'NY', 'TX']);
    }, 2000);
  }, []);

  const columns = useMemo<RDT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
      {
        accessorKey: 'state',
        editSelectOptions: stateEditOptions,
        editVariant: 'select',
        header: 'State',
      },
      {
        accessorKey: 'phoneNumber',
        header: 'Phone Number',
      },
    ],
    [stateEditOptions],
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      editDisplayMode="row"
      enableEditing
    />
  );
};

export const RenderRowActionsAsync = () => {
  const [rowActions, setRowActions] = useState<string[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setRowActions(['Edit', 'Delete']);
    }, 2000);
  }, []);

  const columns = useMemo<RDT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
      {
        accessorKey: 'state',
        header: 'State',
      },
      {
        accessorKey: 'phoneNumber',
        header: 'Phone Number',
      },
    ],
    [],
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      enableRowActions
      renderRowActions={() => (
        <div style={{ display: 'flex', gap: '1rem', whiteSpace: 'nowrap' }}>
          {rowActions.map((action) => (
            <button key={action} type="button">
              {action}
            </button>
          ))}
        </div>
      )}
    />
  );
};

export const renderRowActionMenuItemsAsync = () => {
  const [rowActions, setRowActions] = useState<string[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setRowActions(['Edit', 'Delete']);
    }, 2000);
  }, []);

  const columns = useMemo<RDT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
      {
        accessorKey: 'state',
        header: 'State',
      },
      {
        accessorKey: 'phoneNumber',
        header: 'Phone Number',
      },
    ],
    [],
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      enableRowActions
      renderRowActionMenuItems={() =>
        rowActions.map((action) => [
          <button
            key={action}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px 16px',
              width: '100%',
              textAlign: 'left',
            }}
          >
            {action}
          </button>,
        ])
      }
    />
  );
};

export const DelayedFacetedValues = () => {
  const [tableData, setTableData] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setTableData(data);
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <DataTable
      columns={[
        {
          accessorKey: 'firstName',
          filterFn: 'fuzzy', // default
          header: 'First Name',
        },
        {
          accessorKey: 'lastName',
          filterVariant: 'select',
          header: 'Last Name',
        },
        {
          accessorKey: 'age',
          filterVariant: 'range-slider',
          header: 'Age',
        },
        {
          accessorKey: 'gender',
          filterVariant: 'select',
          header: 'Gender',
        },
        {
          accessorKey: 'state',
          filterVariant: 'multi-select',
          header: 'State',
        },
      ]}
      data={tableData}
      enableFacetedValues
      initialState={{ showColumnFilters: true }}
      state={{
        isLoading,
      }}
    />
  );
};

export const PreventUnnecessaryPaginationChangeByOutOfBoundsCheck = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const columns: RDT_ColumnDef<Person>[] = [
    {
      accessorKey: 'firstName',
      header: 'First Name',
    },
    {
      accessorKey: 'lastName',
      header: 'Last Name',
    },
    {
      accessorKey: 'address',
      header: 'Address',
    },
  ];

  const handlePaginationChange = (updater: Updater<RDT_PaginationState>) => {
    console.log('Pagination change should not be triggered');
    setPagination(updater);
  };

  return (
    <DataTable
      columns={columns}
      data={[]}
      manualPagination={true}
      rowCount={0}
      enablePagination
      onPaginationChange={handlePaginationChange}
      state={{ pagination }}
    />
  );
};
