import { type RDT_ColumnDef, DataTable } from '../../src';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';
import { useState } from 'react';

const meta: Meta = {
  title: 'Features/Search Examples',
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
  {
    accessorKey: 'state',
    header: 'State',
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
  },
];

const data = [...Array(200)].map(() => ({
  address: faker.location.streetAddress(),
  age: +faker.number.float({ max: 100, min: 0 }),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
}));

export const SearchEnabledDefault = () => (
  <DataTable columns={columns} data={data} />
);

export const SearchInitialState = () => (
  <DataTable
    columns={columns}
    data={data}
    initialState={{ globalFilter: 'John' }}
  />
);

export const SearchInitializedState = () => {
  const [globalFilter, setGlobalFilter] = useState('John');

  return (
    <DataTable
      columns={columns}
      data={data}
      state={{ globalFilter }}
      onGlobalFilterChange={setGlobalFilter}
    />
  );
};

export const SearchContains = () => (
  <DataTable columns={columns} data={data} globalFilterFn="contains" />
);

export const CustomGlobalFilterFn = () => (
  <DataTable
    columns={columns}
    data={data}
    filterFns={{
      myCustomFilterFn: (row, id, filterValue) =>
        row.getValue<string>(id).startsWith(filterValue),
    }}
    globalFilterFn="myCustomFilterFn"
  />
);

export const SearchGlobalFilterModes = () => (
  <DataTable columns={columns} data={data} enableGlobalFilterModes />
);

export const SearchGlobalFilterModeOptions = () => (
  <DataTable
    columns={columns}
    data={data}
    enableGlobalFilterModes
    globalFilterModeOptions={['contains', 'fuzzy']}
  />
);

export const SearchRankedResultsEnabledByDefault = () => (
  <DataTable columns={columns} data={data} enableRowNumbers />
);

export const SearchDisableRankedResults = () => (
  <DataTable
    columns={columns}
    data={data}
    enableGlobalFilterRankedResults={false}
    enableRowNumbers
  />
);

export const ShowSearchRightBoxByDefault = () => (
  <DataTable
    columns={columns}
    data={data}
    initialState={{ showGlobalFilter: true }}
  />
);

export const ShowSearchBoxLeftByDefault = () => (
  <DataTable
    columns={columns}
    data={data}
    initialState={{ showGlobalFilter: true }}
    positionGlobalFilter="left"
  />
);

export const ShowSearchBoxLeftByDefaultWithSelection = () => (
  <DataTable
    columns={columns}
    data={data}
    enableRowSelection
    initialState={{ showGlobalFilter: true }}
    positionGlobalFilter="left"
  />
);

export const JustASearchBox = () => (
  <DataTable
    columns={columns}
    data={data}
    enableToolbarInternalActions={false}
    initialState={{ showGlobalFilter: true }}
  />
);

export const SearchDisabled = () => (
  <DataTable columns={columns} data={data} enableGlobalFilter={false} />
);
