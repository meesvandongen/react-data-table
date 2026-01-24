import { RDT_AggregationFns, type RDT_ColumnDef, DataTable } from '../../src';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Features/Aggregation Examples',
};

export default meta;

const data = [...Array(2000)].map(() => ({
  age: faker.number.int({ max: 65, min: 18 }),
  firstName: faker.person.firstName(),
  gender: Math.random() < 0.95 ? faker.person.sex() : faker.person.gender(),
  lastName: faker.person.lastName(),
  salary: Number(faker.finance.amount({ dec: 0, max: 100000, min: 10000 })),
  state: faker.location.state(),
}));

const averageSalary =
  data.reduce((acc, curr) => acc + curr.salary, 0) / data.length;

const averageAge = data.reduce((acc, curr) => acc + curr.age, 0) / data.length;

const columns = [
  {
    AggregatedCell: () => '-',
    accessorKey: 'firstName',
    enableGrouping: false,
    header: 'First Name',
  },
  {
    AggregatedCell: () => '-',
    accessorKey: 'lastName',
    enableGrouping: false,
    header: 'Last Name',
  },
  {
    AggregatedCell: ({ cell, table }) => (
      <>
        Max by{' '}
        {table.getColumn(cell.row.groupingColumnId ?? '').columnDef.header}:{' '}
        <span style={{ color: 'var(--rdt-color-success)', fontWeight: 'bold' }}>
          {cell.getValue<number>()}
        </span>
      </>
    ),
    Footer: () => (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        Average Age:
        <span style={{ color: 'var(--rdt-color-warning)' }}>
          {Math.round(averageAge)}
        </span>
      </div>
    ),
    accessorKey: 'age',
    aggregationFn: 'max',
    header: 'Age',
  },
  {
    GroupedCell: ({ cell }) => (
      <span style={{ color: 'var(--rdt-color-primary)' }}>
        {cell.getValue<string>()}
      </span>
    ),
    accessorKey: 'gender',
    header: 'Gender',
  },
  {
    accessorKey: 'state',
    header: 'State',
  },
  {
    AggregatedCell: ({ cell, table }) => (
      <>
        Average by{' '}
        {table.getColumn(cell.row.groupingColumnId ?? '').columnDef.header}:{' '}
        <span style={{ color: 'var(--rdt-color-success)', fontWeight: 'bold' }}>
          {cell.getValue<number>()?.toLocaleString?.('en-US', {
            currency: 'USD',
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
            style: 'currency',
          })}
        </span>
      </>
    ),
    Cell: ({ cell }) => (
      <>
        {cell.getValue<number>()?.toLocaleString?.('en-US', {
          currency: 'USD',
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
          style: 'currency',
        })}
      </>
    ),
    Footer: () => (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        Average Salary:
        <span style={{ color: 'var(--rdt-color-warning)' }}>
          {averageSalary?.toLocaleString?.('en-US', {
            currency: 'USD',
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
            style: 'currency',
          })}
        </span>
      </div>
    ),
    accessorKey: 'salary',
    aggregationFn: 'mean',
    enableGrouping: false,
    header: 'Salary',
  },
] as RDT_ColumnDef<(typeof data)[0]>[];

export const Aggregation = () => (
  <DataTable columns={columns} data={data} enableGrouping />
);

export const AggregationWithSelection = () => (
  <DataTable columns={columns} data={data} enableGrouping enableRowSelection />
);

export const AggregationExpandedDefault = () => (
  <DataTable
    columns={columns}
    data={data}
    enableGrouping
    initialState={{ expanded: true }}
  />
);

export const AggregationRemoveMode = () => (
  <DataTable
    columns={columns}
    data={data}
    enableGrouping
    groupedColumnMode="remove"
    initialState={{ expanded: true, grouping: ['state', 'gender'] }}
  />
);

export const AggregationFalseMode = () => (
  <DataTable
    columns={columns}
    data={data}
    enableGrouping
    groupedColumnMode={false}
    initialState={{ expanded: true, grouping: ['state', 'gender'] }}
  />
);

export const AggregationRemoveModeCustomGroupedCell = () => (
  <DataTable
    columns={columns}
    data={data}
    displayColumnDefOptions={{
      'rdt-row-expand': {
        //last item in array of grouping state
        GroupedCell: ({ row, table }) => {
          const { grouping } = table.getState();
          return row.getValue(grouping[grouping.length - 1]);
        },
      },
    }}
    enableGrouping
    groupedColumnMode="remove"
    initialState={{ expanded: true, grouping: ['state', 'gender'] }}
  />
);

export const AggregationGroupedAndExpandedDefault = () => (
  <DataTable
    columns={columns}
    data={data}
    enableGrouping
    initialState={{
      expanded: true,
      grouping: ['state', 'gender'],
      isFullScreen: true,
      pagination: { pageIndex: 0, pageSize: 20 },
    }}
  />
);

export const MultiAggregationPerColumn = () => (
  <DataTable
    columns={[
      {
        accessorKey: 'firstName',
        enableGrouping: false,
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        enableGrouping: false,
        header: 'Last Name',
      },
      {
        AggregatedCell: ({ cell, table }) => (
          <>
            Min by{' '}
            {table.getColumn(cell.row.groupingColumnId ?? '').columnDef.header}:{' '}
            <span
              style={{ color: 'var(--rdt-color-success)', fontWeight: 'bold' }}
            >
              {cell.getValue<[number, number]>()[0]}
            </span>
            <br />
            Max by{' '}
            {
              table.getColumn(cell.row.groupingColumnId ?? '').columnDef.header
            }:{' '}
            <span
              style={{ color: 'var(--rdt-color-success)', fontWeight: 'bold' }}
            >
              {cell.getValue<[number, number]>()[1]}
            </span>
          </>
        ),
        Footer: () => (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            Average Age:
            <span style={{ color: 'var(--rdt-color-warning)' }}>
              {Math.round(averageAge)}
            </span>
          </div>
        ),
        accessorKey: 'age',
        //manually set multiple aggregation functions
        aggregationFn: (columnId, leafRows: any, childRows: any) => [
          RDT_AggregationFns.min(columnId, leafRows, childRows),
          RDT_AggregationFns.max(columnId, leafRows, childRows),
        ],
        header: 'Age',
      },
      {
        GroupedCell: ({ cell }) => (
          <span style={{ color: 'var(--rdt-color-primary)' }}>
            {cell.getValue<string>()}
          </span>
        ),
        accessorKey: 'gender',
        header: 'Gender',
      },
      {
        accessorKey: 'state',
        header: 'State',
      },
      {
        AggregatedCell: ({ cell, table }) => (
          <>
            Count:{' '}
            <span
              style={{ color: 'var(--rdt-color-success)', fontWeight: 'bold' }}
            >
              {cell.getValue<[number, number]>()?.[0]}
            </span>
            <br />
            Average by{' '}
            {
              table.getColumn(cell.row.groupingColumnId ?? '').columnDef.header
            }:{' '}
            <span
              style={{ color: 'var(--rdt-color-success)', fontWeight: 'bold' }}
            >
              {cell
                .getValue<[number, number]>()?.[1]
                ?.toLocaleString?.('en-US', {
                  currency: 'USD',
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                  style: 'currency',
                })}
            </span>
          </>
        ),
        Cell: ({ cell }) => (
          <>
            {cell.getValue<number>()?.toLocaleString?.('en-US', {
              currency: 'USD',
              maximumFractionDigits: 0,
              minimumFractionDigits: 0,
              style: 'currency',
            })}
          </>
        ),
        Footer: () => (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            Average Salary:
            <span style={{ color: 'var(--rdt-color-warning)' }}>
              {averageSalary?.toLocaleString?.('en-US', {
                currency: 'USD',
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
                style: 'currency',
              })}
            </span>
          </div>
        ),
        accessorKey: 'salary',
        aggregationFn: ['count', 'mean'], //multiple aggregation functions
        enableGrouping: false,
        header: 'Salary',
      },
    ]}
    data={data}
    enableGrouping
    initialState={{
      expanded: true,
      grouping: ['state', 'gender'],
      isFullScreen: true,
      pagination: { pageIndex: 0, pageSize: 20 },
    }}
  />
);
