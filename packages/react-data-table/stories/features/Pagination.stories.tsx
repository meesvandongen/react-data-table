import { type RDT_ColumnDef, DataTable } from '../../src';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Features/Pagination Examples',
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

const moreData = [...Array(551)].map(() => ({
  address: faker.location.streetAddress(),
  age: faker.number.int(80),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
}));

const bigData = [...Array(11_111)].map(() => ({
  address: faker.location.streetAddress(),
  age: faker.number.int(80),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
}));

export const PaginationEnabledDefault = () => (
  <DataTable columns={columns} data={data} />
);

export const PaginationEnabledDefaultMoreData = () => (
  <DataTable
    columns={columns}
    data={moreData}
    tableContainerProps={{
      style: {
        minHeight: '600px',
      },
    }}
  />
);

export const PaginationEnabledDefaultBigData = () => (
  <DataTable
    columns={columns}
    data={bigData}
    enableRowVirtualization
    initialState={{ pagination: { pageIndex: 0, pageSize: 1000 } }}
    paginationProps={{ rowsPerPageOptions: [100, 1000] }}
    tableContainerProps={{
      style: {
        height: '600px',
      },
    }}
  />
);

export const PaginationEnabledDefaultNoRowsPerPage = () => (
  <DataTable
    columns={columns}
    data={data}
    paginationProps={{
      showRowsPerPage: false,
    }}
  />
);

export const PaginationPagesDisplayMode = () => (
  <DataTable columns={columns} data={data} paginationDisplayMode="pages" />
);

export const PaginationPagesDisplayModeNoPagesPerRow = () => (
  <DataTable
    columns={columns}
    data={data}
    paginationProps={{
      showRowsPerPage: false,
    }}
    paginationDisplayMode="pages"
  />
);

export const PaginationPagesDisplayModeMoreData = () => (
  <DataTable columns={columns} data={moreData} paginationDisplayMode="pages" />
);

export const PaginationDisabledOrOverriden = () => (
  <DataTable columns={columns} data={data} enablePagination={false} />
);

export const PaginationPositionBottom = () => (
  <DataTable columns={columns} data={data} positionPagination="bottom" />
);

export const PaginationPositionTop = () => (
  <DataTable columns={columns} data={data} positionPagination="top" />
);

export const PaginationPositionTopAndBottom = () => (
  <DataTable columns={columns} data={data} positionPagination="both" />
);

export const PaginationPositionTopAndBottomNoInternalActions = () => (
  <DataTable
    columns={columns}
    data={data}
    enableToolbarInternalActions={false}
    positionPagination="both"
  />
);

export const CustomizePaginationComponents = () => (
  <DataTable
    columns={columns}
    data={data}
    initialState={{ pagination: { pageIndex: 0, pageSize: 5 } }}
    paginationProps={{
      rowsPerPageOptions: [5, 10, 20],
      showFirstButton: false,
      showLastButton: false,
    }}
  />
);
