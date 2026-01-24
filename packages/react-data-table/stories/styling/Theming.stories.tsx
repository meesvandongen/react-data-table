import { type RDT_ColumnDef, DataTable } from '../../src';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Styling/Theming',
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

export const DefaultTheme = () => (
  <DataTable columns={columns} data={data} enableRowSelection />
);

export const CustomLightTheme = () => (
  <div
    style={
      {
        // Override CSS variables for custom theming
        '--rdt-color-primary': '#ff9800',
        '--rdt-color-secondary': '#00bcd4',
        '--rdt-color-background': '#ffffef',
      } as React.CSSProperties
    }
  >
    <DataTable columns={columns} data={data} enableRowSelection />
  </div>
);

export const CustomDarkTheme = () => (
  <div
    data-theme="dark"
    style={
      {
        // Override CSS variables for custom dark theming
        '--rdt-color-primary': '#81980f',
        '--rdt-color-secondary': '#00bcd4',
        '--rdt-color-background': '#1a1a1a',
        '--rdt-color-text': '#ffffff',
      } as React.CSSProperties
    }
  >
    <DataTable columns={columns} data={data} enableRowSelection />
  </div>
);
