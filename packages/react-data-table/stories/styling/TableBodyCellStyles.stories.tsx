import { type RDT_ColumnDef, DataTable } from '../../src';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Styling/Style Table Body Cells',
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

export const DefaultTableBodyCellStyles = () => (
  <DataTable columns={columns} data={data} />
);

export const StyleAllTableBodyCell = () => (
  <DataTable
    columns={columns}
    data={data}
    tableBodyCellProps={{
      style: {
        backgroundColor: 'rgba(52, 210, 235, 0.1)',
        borderRight: '1px solid rgba(224,224,224,1)',
      },
    }}
  />
);

export const StyleTableBodyCellConditionallyIn1Column = () => (
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
        accessorKey: 'age',
        header: 'Age',
        tableBodyCellProps: ({ cell }) => ({
          style: {
            backgroundColor:
              cell.getValue<number>() > 40
                ? 'rgba(22, 184, 44, 0.5)'
                : undefined,
            fontWeight:
              cell.column.id === 'age' && cell.getValue<number>() > 40
                ? '700'
                : '400',
          },
        }),
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
    ]}
    data={data}
  />
);

export const CustomCellRender = () => (
  <DataTable
    columns={[
      {
        Cell: ({ cell }) => (
          <span style={{ fontStyle: 'italic' }}>{cell.getValue<string>()}</span>
        ),
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        Cell: ({ cell }) => (
          <span style={{ color: 'red' }}>{cell.getValue<string>()}</span>
        ),
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        Cell: ({ cell }) => (
          <span
            style={{
              backgroundColor:
                cell.column.id === 'age' && cell.getValue<number>() > 40
                  ? 'rgba(22, 184, 44, 0.5)'
                  : undefined,
              fontStyle: 'italic',
              padding: '0.5rem',
            }}
          >
            {cell.getValue<string>()}
          </span>
        ),
        accessorKey: 'age',
        header: 'Age',
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
    ]}
    data={data}
  />
);
