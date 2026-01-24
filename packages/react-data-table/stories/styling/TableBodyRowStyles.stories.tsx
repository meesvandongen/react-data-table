import { type RDT_ColumnDef, DataTable } from '../../src';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Styling/Style Table Body Rows',
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

export const DefaultTableBodyRowStyles = () => (
  <DataTable columns={columns} data={data} />
);

export const DisableRowHoverEffect = () => (
  <DataTable
    columns={columns}
    data={data}
    tableBodyRowProps={{
      className: 'no-hover',
      style: {
        // CSS to disable hover effect
      },
    }}
  />
);

export const StyleTableBodyRow = () => (
  <DataTable
    columns={columns}
    data={data}
    tableBodyRowProps={{
      style: {
        backgroundColor: 'rgba(52, 210, 235, 0.1)',
        borderRight: '1px solid rgba(224,224,224,1)',
      },
    }}
  />
);

export const StyleCustomStripedRows = () => (
  <DataTable
    columns={columns}
    data={data}
    tableBodyCellProps={{ style: { border: 'none' } }}
    tableBodyProps={{
      className: 'striped-rows',
      style: {
        // Using CSS for striped rows - would need CSS class or inline approach
      },
    }}
  />
);

export const StyleCustomStripedRowsDetailPanel = () => (
  <DataTable
    columns={columns}
    data={data}
    tableBodyCellProps={{ style: { border: 'none' } }}
    tableBodyProps={{
      className: 'striped-rows-detail-panel',
    }}
    renderDetailPanel={() => <div>Detail Panel</div>}
  />
);

export const ConditionallyStyleTableRow = () => (
  <DataTable
    columns={columns}
    data={data}
    tableBodyRowProps={({ row }) => ({
      style: {
        backgroundColor:
          row.getValue<number>('age') > 50 ? 'rgba(255, 54, 33, 0.18)' : '',
        fontStyle: 'italic',
      },
    })}
  />
);
