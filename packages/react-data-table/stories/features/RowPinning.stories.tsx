import { useState } from 'react';
import { type RDT_ColumnDef, DataTable } from '../../src';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Features/Row Pinning Examples',
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
    accessorKey: 'email',
    header: 'Email Address',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
  {
    accessorKey: 'city',
    header: 'City',
  },
  {
    accessorKey: 'state',
    header: 'State',
  },
];

const data = [...Array(50)].map(() => ({
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  state: faker.location.state(),
}));

export const RowPinningStickyDefaultEnabled = () => (
  <DataTable columns={columns} data={data} enableRowPinning />
);

export const RowPinningEnabledConditionally = () => {
  const [enableRowPinning, setEnableRowPinning] = useState(false);
  return (
    <DataTable
      columns={columns}
      data={data}
      enableRowPinning={enableRowPinning}
      renderTopToolbarCustomActions={() => (
        <button onClick={() => setEnableRowPinning(!enableRowPinning)}>
          Toggle Row Pinning
        </button>
      )}
    />
  );
};

export const RowPinningStickyNoPagination = () => (
  <DataTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    tableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
  />
);

export const RowPinningStickyCustomRowHeight = () => (
  <DataTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    tableBodyRowProps={{
      style: {
        height: '100px',
      },
    }}
    tableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="sticky"
  />
);

export const RowPinningSelectStickyMode = () => (
  <DataTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableRowSelection
    tableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="select-sticky"
  />
);

export const RowPinningTopAndBottomMode = () => (
  <DataTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    tableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="top-and-bottom"
  />
);

export const RowPinningTopMode = () => (
  <DataTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    keepPinnedRows={false}
    tableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="top"
  />
);

export const RowPinningSelectTopMode = () => (
  <DataTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableRowSelection
    tableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="select-top"
  />
);

export const RowPinningBottomMode = () => (
  <DataTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    tableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="bottom"
  />
);

export const RowPinningSelectBottomMode = () => (
  <DataTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableRowSelection
    tableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="select-bottom"
  />
);

export const RowPinningWithStickyHeader = () => (
  <DataTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableStickyFooter
    enableStickyHeader
    tableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
  />
);

export const RowPinningWithGridLayout = () => (
  <DataTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    layoutMode="grid"
    tableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
  />
);

export const RowPinningStickyWithVirtualization = () => (
  <DataTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableRowVirtualization
    tableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
  />
);

export const RowPinningTopWithVirtualization = () => (
  <DataTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableRowVirtualization
    tableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="top"
  />
);

export const RowAndColumnPinning = () => (
  <DataTable
    columns={columns}
    data={data}
    enableColumnPinning
    enablePagination={false}
    enableRowPinning
    initialState={{
      columnPinning: {
        left: ['firstName'],
        right: ['lastName'],
      },
      rowPinning: {
        top: ['3', '5'],
      },
    }}
    tableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
  />
);
