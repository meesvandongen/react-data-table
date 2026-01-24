import { type RDT_ColumnDef, DataTable } from '../../src';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Styling/Table Paper Examples',
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

const data = [...Array(25)].map(() => ({
  address: faker.location.streetAddress(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
}));

export const NoBoxShadow = () => (
  <DataTable
    columns={columns}
    data={data}
    tablePaperProps={{
      style: {
        boxShadow: 'none',
      },
    }}
  />
);

export const CustomBorder = () => (
  <DataTable
    columns={columns}
    data={data}
    tablePaperProps={{
      style: {
        border: '2px solid var(--rdt-color-primary)',
        borderRadius: '8px',
      },
    }}
  />
);

export const CustomBackground = () => (
  <DataTable
    columns={columns}
    data={data}
    tablePaperProps={{
      style: {
        backgroundColor: '#f5f5f5',
      },
    }}
  />
);
