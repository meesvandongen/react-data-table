import { type RDT_ColumnDef, DataTable } from '../../src';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Styling/Styling Display Columns',
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

export const CustomizeDisplayColumns = () => (
  <DataTable
    columns={columns}
    data={data}
    displayColumnDefOptions={{
      'rdt-row-actions': {
        tableHeadCellProps: {
          style: {
            fontSize: '1.25rem',
            fontStyle: 'italic',
          },
        },
        size: 160,
      },
      'rdt-row-expand': {
        enableColumnActions: true,
        enableResizing: true,
        size: 70,
      },
      'rdt-row-numbers': {
        enableColumnOrdering: true,
        tableBodyCellProps: {
          style: {
            color: 'red',
            fontSize: '1.5rem',
          },
        },
      },
    }}
    enableColumnOrdering
    enableColumnResizing
    enableRowActions
    enableRowNumbers
    enableRowSelection
    renderDetailPanel={() => <div>Detail Panel</div>}
    renderRowActions={({ row }) => (
      <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '0.5rem' }}>
        <button
          onClick={() => {
            console.info('View Profile', row);
          }}
          style={{
            backgroundColor: 'var(--rdt-color-primary)',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer',
            padding: '6px 12px',
          }}
        >
          View
        </button>
        <button
          onClick={() => {
            console.info('Remove', row);
          }}
          style={{
            backgroundColor: 'var(--rdt-color-error)',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer',
            padding: '6px 12px',
          }}
        >
          Remove
        </button>
      </div>
    )}
  />
);
