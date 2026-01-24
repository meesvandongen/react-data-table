import { useState } from 'react';
import {
  type RDT_ColumnDef,
  type RDT_SortingState,
  DataTable,
} from '../../src';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Features/Sorting Examples',
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

const data = [...Array(100)].map(() => ({
  address: faker.location.streetAddress(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
}));

export const SortingEnabledDefault = () => (
  <DataTable columns={columns} data={data} />
);

export const DisableSorting = () => (
  <DataTable columns={columns} data={data} enableSorting={false} />
);

export const DisableSortingForSpecificColumns = () => (
  <DataTable
    columns={[
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
        enableSorting: false,
        header: 'Address',
      },
      {
        accessorKey: 'state',
        header: 'State',
      },
      {
        accessorKey: 'phoneNumber',
        enableSorting: false,
        header: 'Phone Number',
      },
    ]}
    data={data}
  />
);

export const DisableMultiSorting = () => (
  <DataTable columns={columns} data={data} enableMultiSort={false} />
);

export const DisableSortingRemoval = () => (
  <DataTable columns={columns} data={data} enableSortingRemoval={false} />
);

export const SortRanking = () => (
  <DataTable
    columns={[
      {
        accessorKey: 'firstName',
        header: 'First Name',
        sortingFn: 'fuzzy',
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
    ]}
    data={data}
    enableRowNumbers
    initialState={{ sorting: [{ desc: false, id: 'firstName' }] }}
  />
);

export const SortingStateManaged = () => {
  const [sorting, setSorting] = useState<RDT_SortingState>([]);
  return (
    <DataTable
      columns={columns}
      data={data}
      onSortingChange={setSorting}
      state={{ sorting }}
    />
  );
};
