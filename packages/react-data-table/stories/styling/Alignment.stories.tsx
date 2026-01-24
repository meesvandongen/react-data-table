import { type RDT_ColumnDef, DataTable } from '../../src';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Styling/Table Alignment Examples',
};

export default meta;

const columns: RDT_ColumnDef<(typeof data)[0]>[] = [
  {
    accessorKey: 'firstName',
    footer: 'First Name',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    footer: 'Last Name',
    header: 'Last Name',
  },
  {
    accessorKey: 'age',
    footer: 'Age',
    header: 'Age',
  },
  {
    accessorKey: 'address',
    footer: 'Address',
    header: 'Address',
  },
  {
    accessorKey: 'state',
    footer: 'State',
    header: 'State',
  },
  {
    accessorKey: 'phoneNumber',
    footer: 'Phone Number',
    header: 'Phone Number',
  },
];

const data = [...Array(25)].map(() => ({
  address: faker.location.streetAddress(),
  age: faker.number.int({ max: 60, min: 20 }),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
}));

export const DefaultLeft = () => <DataTable columns={columns} data={data} />;

export const DefaultLeftGrid = () => (
  <DataTable columns={columns} data={data} layoutMode="grid" />
);

export const RightCells = () => (
  <DataTable
    columns={columns}
    data={data}
    defaultColumn={{
      tableBodyCellProps: {
        align: 'right',
      },
      tableFooterCellProps: {
        align: 'right',
      },
      tableHeadCellProps: {
        align: 'right',
      },
    }}
  />
);

export const RightCellsGrid = () => (
  <DataTable
    columns={columns}
    data={data}
    layoutMode="grid"
    defaultColumn={{
      tableBodyCellProps: {
        align: 'right',
      },
      tableFooterCellProps: {
        align: 'right',
      },
      tableHeadCellProps: {
        align: 'right',
      },
    }}
  />
);

export const CenterCells = () => (
  <DataTable
    columns={columns}
    data={data}
    defaultColumn={{
      tableBodyCellProps: {
        align: 'center',
      },
      tableFooterCellProps: {
        align: 'center',
      },
      tableHeadCellProps: {
        align: 'center',
      },
    }}
  />
);

export const CenterCellsGrid = () => (
  <DataTable
    columns={columns}
    data={data}
    layoutMode="grid"
    defaultColumn={{
      tableBodyCellProps: {
        align: 'center',
      },
      tableFooterCellProps: {
        align: 'center',
      },
      tableHeadCellProps: {
        align: 'center',
      },
    }}
  />
);

export const CenterCellsWithGrabHandle = () => (
  <DataTable
    columns={columns}
    data={data}
    enableColumnDragging
    defaultColumn={{
      tableBodyCellProps: {
        align: 'center',
      },
      tableFooterCellProps: {
        align: 'center',
      },
      tableHeadCellProps: {
        align: 'center',
      },
    }}
  />
);

export const CenterCellsWithGrabHandleNoSorting = () => (
  <DataTable
    columns={columns}
    data={data}
    enableColumnDragging
    enableSorting={false}
    defaultColumn={{
      tableBodyCellProps: {
        align: 'center',
      },
      tableFooterCellProps: {
        align: 'center',
      },
      tableHeadCellProps: {
        align: 'center',
      },
    }}
  />
);

export const CenterCellsNoColumnActions = () => (
  <DataTable
    columns={columns}
    data={data}
    enableColumnActions={false}
    defaultColumn={{
      tableBodyCellProps: {
        align: 'center',
      },
      tableFooterCellProps: {
        align: 'center',
      },
      tableHeadCellProps: {
        align: 'center',
      },
    }}
  />
);

export const RightAlignNumberColumn = () => (
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
        accessorKey: 'age',
        header: 'Age',
        tableBodyCellProps: {
          align: 'right',
        },
        tableHeadCellProps: {
          align: 'right',
        },
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
  />
);
