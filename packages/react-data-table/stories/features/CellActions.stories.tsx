import { Mail, UserX } from 'lucide-react';
import { type RDT_ColumnDef, DataTable } from '../../src';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Features/Cell Action Examples',
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

export const CellActionsEnabled = () => (
  <DataTable
    columns={columns}
    data={data}
    enableCellActions
    enableClickToCopy="context-menu"
  />
);

export const CellActionsEnabledConditionally = () => (
  <DataTable
    columns={columns}
    data={data}
    enableCellActions={(cell) => cell.row.index % 2 === 0}
    enableClickToCopy="context-menu"
  />
);

export const CellActionsEnabledCustom = () => (
  <DataTable
    columns={columns}
    data={data}
    enableCellActions
    renderCellActionMenuItems={({ closeMenu }) => [
      <button
        key={1}
        onClick={() => {
          closeMenu();
        }}
        style={{
          alignItems: 'center',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          gap: '8px',
          padding: '8px 16px',
          width: '100%',
        }}
      >
        <Mail size={16} />
        Item 1
      </button>,
      <button
        key={2}
        onClick={() => {
          closeMenu();
        }}
        style={{
          alignItems: 'center',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          gap: '8px',
          padding: '8px 16px',
          width: '100%',
        }}
      >
        <UserX size={16} />
        Item 2
      </button>,
    ]}
  />
);

export const CellActionsWithClickToCopy = () => (
  <DataTable
    columns={columns}
    data={data}
    enableCellActions
    enableClickToCopy
    renderCellActionMenuItems={({ closeMenu }) => [
      <button
        key={1}
        onClick={() => {
          closeMenu();
        }}
        style={{
          alignItems: 'center',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          gap: '8px',
          padding: '8px 16px',
          width: '100%',
        }}
      >
        <Mail size={16} />
        Item 1
      </button>,
      <button
        key={2}
        onClick={() => {
          closeMenu();
        }}
        style={{
          alignItems: 'center',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          gap: '8px',
          padding: '8px 16px',
          width: '100%',
        }}
      >
        <UserX size={16} />
        Item 2
      </button>,
    ]}
  />
);

export const CellActionsWithBuiltIns = () => (
  <DataTable
    columns={columns}
    data={data}
    editDisplayMode="cell"
    enableCellActions
    enableClickToCopy="context-menu"
    enableEditing
    renderCellActionMenuItems={({ closeMenu, internalMenuItems }) => [
      ...internalMenuItems,
      <hr key="divider" style={{ margin: '4px 0' }} />,
      <button
        key={1}
        onClick={() => {
          closeMenu();
        }}
        style={{
          alignItems: 'center',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          gap: '8px',
          padding: '8px 16px',
          width: '100%',
        }}
      >
        <Mail size={16} />
        Item 1
      </button>,
      <button
        key={2}
        onClick={() => {
          closeMenu();
        }}
        style={{
          alignItems: 'center',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          gap: '8px',
          padding: '8px 16px',
          width: '100%',
        }}
      >
        <UserX size={16} />
        Item 2
      </button>,
    ]}
  />
);
