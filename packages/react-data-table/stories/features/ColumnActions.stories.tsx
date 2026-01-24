import { type RDT_ColumnDef, DataTable } from '../../src';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Features/Column Action Examples',
};

export default meta;

interface Row {
  address: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  state: string;
}

const columns: RDT_ColumnDef<Row>[] = [
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

const data: Row[] = [...Array(100)].map(() => ({
  address: faker.location.streetAddress(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
}));

export const ColumnActionsEnabledDefault = () => (
  <DataTable columns={columns} data={data} />
);

export const ColumnActionsDisabled = () => (
  <DataTable columns={columns} data={data} enableColumnActions={false} />
);

export const ColumnActionsDisabledPerColumn = () => (
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
        enableColumnActions: false,
        header: 'Address',
      },
      {
        accessorKey: 'state',
        enableColumnActions: false,
        header: 'State',
      },
      {
        accessorKey: 'phoneNumber',
        enableColumnActions: false,
        header: 'Phone Number',
      },
    ]}
    data={data}
  />
);

export const ColumnActionsEnabledPerColumn = () => (
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
        enableColumnActions: true,
        header: 'Address',
      },
      {
        accessorKey: 'state',
        enableColumnActions: true,
        header: 'State',
      },
      {
        accessorKey: 'phoneNumber',
        enableColumnActions: true,
        header: 'Phone Number',
      },
    ]}
    data={data}
    enableColumnActions={false}
  />
);

export const CustomColumnActions = () => (
  <DataTable
    columns={columns}
    data={data}
    renderColumnActionsMenuItems={() => [
      <div key={1} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
        Item 1
      </div>,
      <div key={2} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
        Item 2
      </div>,
    ]}
  />
);

export const CustomColumnActionsPerColumn = () => (
  <DataTable
    columns={[
      {
        accessorKey: 'firstName',
        header: 'First Name',
        renderColumnActionsMenuItems: () => [
          <div key={1} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
            Item 1
          </div>,
          <div key={2} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
            Item 2
          </div>,
        ],
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        renderColumnActionsMenuItems: () => [
          <div key={1} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
            Item 2
          </div>,
          <div key={3} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
            Item 3
          </div>,
        ],
      },
      {
        accessorKey: 'address',
        enableColumnActions: true,
        header: 'Address',
        renderColumnActionsMenuItems: ({ internalColumnMenuItems }) => [
          ...internalColumnMenuItems,
          <hr key={3332} style={{ margin: '0.5rem 0' }} />,
          <div key={3333} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
            Item 1
          </div>,
          <div key={3334} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
            Item 2
          </div>,
        ],
      },
      {
        accessorKey: 'state',
        enableColumnActions: true,
        header: 'State',
      },
      {
        accessorKey: 'phoneNumber',
        enableColumnActions: true,
        header: 'Phone Number',
      },
    ]}
    data={data}
  />
);
