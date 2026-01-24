import { type RDT_ColumnDef, DataTable } from '../../src';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Styling/Style Table Head Cells',
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
const data = [...Array(21)].map(() => ({
  address: faker.location.streetAddress(),
  age: faker.number.int(80),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
}));

export const DefaultTableHeadCellStyles = () => (
  <DataTable columns={columns} data={data} />
);

export const ColorSortIcon = () => (
  <DataTable
    columns={columns}
    data={data}
    tableHeadCellProps={({ column }) => ({
      style: {
        // Color sorted columns differently
        color: column.getIsSorted() ? 'limegreen' : undefined,
      },
    })}
  />
);

export const StyleAllTableHeadCell = () => (
  <DataTable
    columns={columns}
    data={data}
    tableHeadCellProps={{
      style: {
        background: 'rgba(52, 210, 235, 0.1)',
        borderRight: '1px solid rgba(224,224,224,1)',
      },
    }}
  />
);

export const StyleTableHeadCellsIndividually = () => (
  <DataTable
    columns={[
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        tableHeadCellProps: {
          style: { color: 'var(--rdt-color-primary)' },
        },
      },
      {
        accessorKey: 'age',
        header: 'Age',
        tableHeadCellProps: {
          style: {
            color: 'red',
          },
        },
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
    ]}
    data={data}
  />
);

export const CustomHeadCellRenders = () => (
  <DataTable
    columns={[
      {
        Header: <em>First Name</em>,
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        Header: () => <em>Last Name</em>,
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        Header: ({ column }) => (
          <span style={{ color: 'var(--rdt-color-primary)' }}>
            {column.columnDef.header}
          </span>
        ),
        accessorKey: 'age',
        header: 'Current Age',
      },
      {
        accessorKey: 'address',
        header: 'Address of Residence (Permanent)',
      },
    ]}
    data={data}
    enableColumnResizing
  />
);
