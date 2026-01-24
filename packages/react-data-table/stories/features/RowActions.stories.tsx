import { useState } from 'react';
import { User, Trash2, Pencil, Share2 } from 'lucide-react';
import { type RDT_ColumnDef, DataTable } from '../../src';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Features/Row Actions Examples',
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

const data = [...Array(10)].map(() => ({
  address: faker.location.streetAddress(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
}));

export const RowActionsEnabled = () => (
  <DataTable
    columns={columns}
    data={data}
    enableRowActions
    renderRowActionMenuItems={({ closeMenu, row }) => [
      <button
        key={1}
        onClick={() => {
          console.info('View Profile', row);
          closeMenu();
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem',
          width: '100%',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
        }}
      >
        <User size={16} /> View Profile
      </button>,
      <button
        key={2}
        onClick={() => {
          console.info('Remove', row);
          closeMenu();
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem',
          width: '100%',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
        }}
      >
        <Trash2 size={16} /> Remove
      </button>,
      <button
        key={3}
        onClick={() => {
          console.info('Share', row);
          closeMenu();
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem',
          width: '100%',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
        }}
      >
        <Share2 size={16} /> Share
      </button>,
    ]}
  />
);

export const RowActionsEnabledConditionally = () => {
  const [enabled, setEnabled] = useState(false);
  return (
    <DataTable
      columns={columns}
      data={data}
      enableRowActions={enabled}
      renderRowActionMenuItems={({ closeMenu, row }) => [
        <button
          key={1}
          onClick={() => {
            console.info('View Profile', row);
            closeMenu();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem',
            width: '100%',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          <User size={16} /> View Profile
        </button>,
        <button
          key={2}
          onClick={() => {
            console.info('Remove', row);
            closeMenu();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem',
            width: '100%',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          <Trash2 size={16} /> Remove
        </button>,
        <button
          key={3}
          onClick={() => {
            console.info('Share', row);
            closeMenu();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem',
            width: '100%',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          <Share2 size={16} /> Share
        </button>,
      ]}
      renderTopToolbarCustomActions={() => (
        <button onClick={() => setEnabled(!enabled)}>Toggle Row Actions</button>
      )}
    />
  );
};

export const RowActionsEnabledConditionallyPerRow = () => {
  return (
    <DataTable
      columns={columns}
      data={data}
      enableRowActions
      renderRowActionMenuItems={({ closeMenu, row }) =>
        row.index % 2 === 0
          ? undefined
          : [
              <button
                key={1}
                onClick={() => {
                  console.info('View Profile', row);
                  closeMenu();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem',
                  width: '100%',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
              >
                <User size={16} /> View Profile
              </button>,
              <button
                key={2}
                onClick={() => {
                  console.info('Remove', row);
                  closeMenu();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem',
                  width: '100%',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
              >
                <Trash2 size={16} /> Remove
              </button>,
              <button
                key={3}
                onClick={() => {
                  console.info('Share', row);
                  closeMenu();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem',
                  width: '100%',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
              >
                <Share2 size={16} /> Share
              </button>,
            ]
      }
    />
  );
};

export const RowActionsAndEditingEnabled = () => (
  <DataTable
    columns={columns}
    data={data}
    enableEditing
    enableRowActions
    renderRowActionMenuItems={({ closeMenu, row }) => [
      <button
        key={1}
        onClick={() => {
          console.info('View Profile', row);
          closeMenu();
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem',
          width: '100%',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
        }}
      >
        <User size={16} /> View Profile
      </button>,
      <button
        key={2}
        onClick={() => {
          console.info('Remove', row);
          closeMenu();
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem',
          width: '100%',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
        }}
      >
        <Trash2 size={16} /> Remove
      </button>,
      <button
        key={3}
        onClick={() => {
          console.info('Share', row);
          closeMenu();
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem',
          width: '100%',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
        }}
      >
        <Share2 size={16} /> Share
      </button>,
    ]}
  />
);

export const RowActionsAndEditingCellEnabled = () => (
  <DataTable
    columns={columns}
    data={data}
    editDisplayMode="cell"
    enableEditing
    enableRowActions
    renderRowActionMenuItems={({ closeMenu, row }) => [
      <button
        key={1}
        onClick={() => {
          console.info('View Profile', row);
          closeMenu();
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem',
          width: '100%',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
        }}
      >
        <User size={16} /> View Profile
      </button>,
      <button
        key={2}
        onClick={() => {
          console.info('Remove', row);
          closeMenu();
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem',
          width: '100%',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
        }}
      >
        <Trash2 size={16} /> Remove
      </button>,
      <button
        key={3}
        onClick={() => {
          console.info('Share', row);
          closeMenu();
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem',
          width: '100%',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
        }}
      >
        <Share2 size={16} /> Share
      </button>,
    ]}
  />
);

export const RowActionsLastColumn = () => (
  <DataTable
    columns={columns}
    data={data}
    enableRowActions
    initialState={{ density: 'compact' }}
    positionActionsColumn="last"
    renderRowActionMenuItems={({ closeMenu, row }) => [
      <button
        key={1}
        onClick={() => {
          console.info('View Profile', row);
          closeMenu();
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem',
          width: '100%',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
        }}
      >
        <User size={16} /> View Profile
      </button>,
      <button
        key={2}
        onClick={() => {
          console.info('Remove', row);
          closeMenu();
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem',
          width: '100%',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
        }}
      >
        <Trash2 size={16} /> Remove
      </button>,
      <button
        key={3}
        onClick={() => {
          console.info('Share', row);
          closeMenu();
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem',
          width: '100%',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
        }}
      >
        <Share2 size={16} /> Share
      </button>,
    ]}
  />
);

export const CustomRowActionButtons = () => (
  <DataTable
    columns={columns}
    data={data}
    enableRowActions
    renderRowActions={({ row }) => (
      <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '0.5rem' }}>
        <button
          onClick={() => {
            console.info('View Profile', row);
          }}
          style={{
            padding: '0.25rem 0.5rem',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          View
        </button>
        <button
          onClick={() => {
            console.info('Remove', row);
          }}
          style={{
            padding: '0.25rem 0.5rem',
            backgroundColor: '#d32f2f',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Remove
        </button>
      </div>
    )}
  />
);

export const CustomRowActionButtonsLastColumn = () => (
  <DataTable
    columns={columns}
    data={data}
    enableRowActions
    positionActionsColumn="last"
    renderRowActions={({ row }) => (
      <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '0.5rem' }}>
        <button
          onClick={() => {
            console.info('View Profile', row);
          }}
          style={{
            padding: '0.25rem 0.5rem',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          View
        </button>
        <button
          onClick={() => {
            console.info('Remove', row);
          }}
          style={{
            padding: '0.25rem 0.5rem',
            backgroundColor: '#d32f2f',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Remove
        </button>
      </div>
    )}
  />
);

export const RowActionsCompleteOverride = () => (
  <DataTable
    columns={columns}
    data={data}
    displayColumnDefOptions={{
      'rdt-row-actions': {
        Cell: ({ row, table }) => (
          <>
            <button
              style={{ padding: '0.25rem 0.5rem', marginRight: '0.5rem' }}
            >
              Custom Row Action
            </button>
            <button
              onClick={() => table.setEditingRow(row)}
              style={{
                padding: '0.25rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Pencil size={16} />
            </button>
          </>
        ),
        size: 300,
      },
    }}
    editDisplayMode="row"
    enableEditing
    enableRowActions
  />
);
