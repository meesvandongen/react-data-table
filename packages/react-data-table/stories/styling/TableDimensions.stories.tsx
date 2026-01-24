import { type RDT_ColumnDef, DataTable } from '../../src';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Styling/Table Dimensions Examples',
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

export const MaxWidthAndCentered = () => (
  <DataTable
    columns={columns}
    data={data}
    tablePaperProps={{
      style: {
        margin: 'auto',
        maxWidth: '800px',
      },
    }}
  />
);

export const maxHeight = () => (
  <DataTable
    columns={columns}
    data={data}
    tableContainerProps={{
      style: {
        maxHeight: '500px',
      },
    }}
  />
);

export const minHeight = () => (
  <DataTable
    columns={columns}
    data={data.slice(0, 5)}
    tableContainerProps={{
      style: {
        minHeight: '800px',
      },
    }}
  />
);

export const minHeightParent = () => (
  <div style={{ height: '700px' }}>
    <DataTable
      columns={columns}
      data={data.slice(0, 5)}
      tableContainerProps={({ table }) => ({
        style: {
          height: `calc(100% - ${table.refs.topToolbarRef.current?.offsetHeight}px - ${table.refs.bottomToolbarRef.current?.offsetHeight}px)`,
        },
      })}
      tablePaperProps={{
        style: {
          height: '100%',
        },
      }}
    />
  </div>
);

export const ContainerHeight = () => (
  <div style={{ height: '300px' }}>
    <DataTable
      columns={columns}
      data={data}
      tableContainerProps={({ table }) => ({
        style: {
          height: `calc(100% - ${table.refs.topToolbarRef.current?.offsetHeight}px - ${table.refs.bottomToolbarRef.current?.offsetHeight}px)`,
        },
      })}
      tablePaperProps={{
        style: {
          height: '100%',
        },
      }}
    />
  </div>
);
