import { type RDT_ColumnDef, DataTable } from '../../src';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Fixed Bugs/Grid Layout',
};

export default meta;

type Person = {
  address: string;
  city: string;
  firstName: string;
  lastName: string;
  state: string;
};

const columns: RDT_ColumnDef<Person>[] = [
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
    accessorKey: 'city',
    header: 'City',
  },
  {
    accessorKey: 'state',
    header: 'State',
  },
];

const data = [...Array(6)].map(() => ({
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  state: faker.location.state(),
}));

export const CenterAlignInGridLayoutMode = () => {
  return (
    <DataTable
      columns={columns}
      data={data}
      layoutMode="grid"
      tableBodyCellProps={{
        align: 'center',
      }}
      tableHeadCellProps={{
        align: 'center',
      }}
    />
  );
};

export const RightAlignInGridLayoutMode = () => {
  return (
    <DataTable
      columns={columns}
      data={data}
      layoutMode="grid"
      tableBodyCellProps={{
        align: 'right',
      }}
      tableHeadCellProps={{
        align: 'right',
      }}
    />
  );
};
