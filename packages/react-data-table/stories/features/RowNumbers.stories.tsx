import { useState } from 'react';
import { type RDT_ColumnDef, DataTable } from '../../src';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Features/Row Number Examples',
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

export const enableRowNumbersStatic = () => (
  <DataTable columns={columns} data={data} enableRowNumbers />
);

export const enableRowNumbersConditionally = () => {
  const [enableRowNumbers, setEnableRowNumbers] = useState(false);
  return (
    <DataTable
      columns={columns}
      data={data}
      enableRowNumbers={enableRowNumbers}
      renderTopToolbarCustomActions={() => (
        <button onClick={() => setEnableRowNumbers(!enableRowNumbers)}>
          Toggle Row Numbers
        </button>
      )}
    />
  );
};

export const enableRowNumbersStaticGrid = () => (
  <DataTable columns={columns} data={data} enableRowNumbers layoutMode="grid" />
);

export const enableRowNumbersStaticGridNoGrow = () => (
  <DataTable
    columns={columns}
    data={data}
    enableRowNumbers
    layoutMode="grid-no-grow"
  />
);

export const enableRowNumbersOriginal = () => (
  <DataTable
    columns={columns}
    data={data}
    enableRowNumbers
    enableRowVirtualization
    rowNumberDisplayMode="original"
  />
);

export const enableRowNumbersOriginalVirtual = () => (
  <DataTable
    columns={columns}
    data={data}
    enableBottomToolbar={false}
    enablePagination={false}
    enableRowNumbers
    rowNumberDisplayMode="original"
  />
);

export const enableRowNumbersStaticVirtual = () => (
  <DataTable
    columns={columns}
    data={data}
    enableBottomToolbar={false}
    enablePagination={false}
    enableRowNumbers
    enableRowVirtualization
    rowNumberDisplayMode="static"
  />
);
