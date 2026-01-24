import { type Meta } from '@storybook/react';
import { DataTable, useDataTable, type RDT_ColumnDef } from '../../src';

const meta: Meta = {
  title: 'Fixed Bugs/AppBar overlaps with Fullscreen Modal',
};

export default meta;

//example data type
type Person = {
  name: {
    firstName: string;
    lastName: string;
  };
  address: string;
  city: string;
  state: string;
};

//nested data is ok, see accessorKeys in ColumnDef below
const data: Person[] = [
  {
    name: {
      firstName: 'John',
      lastName: 'Doe',
    },
    address: '261 Erdman Ford',
    city: 'East Daphne',
    state: 'Kentucky',
  },
  {
    name: {
      firstName: 'Jane',
      lastName: 'Doe',
    },
    address: '769 Dominic Grove',
    city: 'Columbus',
    state: 'Ohio',
  },
  {
    name: {
      firstName: 'Joe',
      lastName: 'Doe',
    },
    address: '566 Brakus Inlet',
    city: 'South Linda',
    state: 'West Virginia',
  },
  {
    name: {
      firstName: 'Kevin',
      lastName: 'Vandy',
    },
    address: '722 Emie Stream',
    city: 'Lincoln',
    state: 'Nebraska',
  },
  {
    name: {
      firstName: 'Joshua',
      lastName: 'Rolluffs',
    },
    address: '32188 Larkin Turnpike',
    city: 'Omaha',
    state: 'Nebraska',
  },
];

const columns: RDT_ColumnDef<Person>[] = [
  {
    accessorKey: 'name.firstName', //access nested data with dot notation
    header: 'First Name',
    size: 150,
  },
  {
    accessorKey: 'name.lastName',
    header: 'Last Name',
    size: 150,
  },
  {
    accessorKey: 'address', //normal accessorKey
    header: 'Address',
    size: 200,
  },
  {
    accessorKey: 'city',
    header: 'City',
    size: 150,
  },
  {
    accessorKey: 'state',
    header: 'State',
    size: 150,
  },
];

export const FullscreenIsAboveAppbar = () => {
  const table = useDataTable({
    columns,
    data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
  });

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          backgroundColor: 'var(--rdt-color-primary)',
          color: 'white',
          padding: '16px',
          zIndex: 1000,
        }}
      >
        <p style={{ margin: 0 }}>App</p>
      </header>
      <div style={{ padding: '16px' }}>
        <DataTable table={table} />
      </div>
    </>
  );
};
