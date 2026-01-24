import { PlusSquare, Trash2 } from 'lucide-react';
import { type RDT_ColumnDef, DataTable } from '../../src';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Features/Toolbar Examples',
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
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
  },
];

const data = [...Array(5)].map(() => ({
  address: faker.location.streetAddress(),
  age: faker.number.int(80),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
}));

export const ToolbarEnabledDefault = () => (
  <DataTable columns={columns} data={data} enableRowSelection />
);

export const TopToolbarHidden = () => (
  <DataTable
    columns={columns}
    data={data}
    enableRowSelection
    enableTopToolbar={false}
  />
);

export const BottomToolbarHidden = () => (
  <DataTable
    columns={columns}
    data={data}
    enableBottomToolbar={false}
    enableRowSelection
  />
);

export const NoToolbars = () => (
  <DataTable
    columns={columns}
    data={data}
    enableBottomToolbar={false}
    enableRowSelection
    enableTopToolbar={false}
  />
);

export const HideToolbarInternalActions = () => (
  <DataTable
    columns={columns}
    data={data}
    enableRowSelection
    enableToolbarInternalActions={false}
  />
);

export const TableTitle = () => (
  <DataTable
    columns={columns}
    data={data}
    enableRowSelection
    renderTopToolbarCustomActions={() => {
      return <h2 style={{ margin: 0 }}>Table Title</h2>;
    }}
  />
);

export const CustomTopToolbarActions = () => (
  <DataTable
    columns={columns}
    data={data}
    enableRowSelection
    renderTopToolbarCustomActions={() => {
      const handleCreateNewUser = () => {
        prompt('Create new user modal');
      };

      return (
        <div>
          <button
            onClick={handleCreateNewUser}
            title="Create New User"
            style={{ padding: '0.5rem', cursor: 'pointer' }}
          >
            <PlusSquare size={20} />
          </button>
        </div>
      );
    }}
  />
);

export const CustomBottomToolbarActions = () => (
  <DataTable
    columns={columns}
    data={data}
    enableRowSelection
    renderBottomToolbarCustomActions={() => {
      const handleCreateNewUser = () => {
        prompt('Create new user modal');
      };

      return (
        <div>
          <button
            onClick={handleCreateNewUser}
            title="Create New User"
            style={{ padding: '0.5rem', cursor: 'pointer' }}
          >
            <PlusSquare size={20} />
          </button>
        </div>
      );
    }}
  />
);

export const CustomTopToolbarSelectionActions = () => (
  <DataTable
    columns={columns}
    data={data}
    enableRowSelection
    renderTopToolbarCustomActions={({ table }) => {
      const handleDeactivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('deactivating ' + row.original.firstName);
        });
      };

      const handleActivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('activating ' + row.original.firstName);
        });
      };

      const handleContact = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('contact ' + row.original.firstName);
        });
      };

      return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleDeactivate}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#d32f2f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor:
                table.getSelectedRowModel().flatRows.length === 0
                  ? 'not-allowed'
                  : 'pointer',
              opacity:
                table.getSelectedRowModel().flatRows.length === 0 ? 0.5 : 1,
            }}
          >
            Deactivate
          </button>
          <button
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleActivate}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#2e7d32',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor:
                table.getSelectedRowModel().flatRows.length === 0
                  ? 'not-allowed'
                  : 'pointer',
              opacity:
                table.getSelectedRowModel().flatRows.length === 0 ? 0.5 : 1,
            }}
          >
            Activate
          </button>
          <button
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleContact}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#0288d1',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor:
                table.getSelectedRowModel().flatRows.length === 0
                  ? 'not-allowed'
                  : 'pointer',
              opacity:
                table.getSelectedRowModel().flatRows.length === 0 ? 0.5 : 1,
            }}
          >
            Contact
          </button>
        </div>
      );
    }}
  />
);

export const CustomBottomToolbarSelectionActions = () => (
  <DataTable
    columns={columns}
    data={data}
    enableRowSelection
    renderBottomToolbarCustomActions={({ table }) => {
      const handleDeactivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('deactivating ' + row.original.firstName);
        });
      };

      const handleActivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('activating ' + row.original.firstName);
        });
      };

      const handleContact = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('contact ' + row.original.firstName);
        });
      };

      return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleDeactivate}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#d32f2f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor:
                table.getSelectedRowModel().flatRows.length === 0
                  ? 'not-allowed'
                  : 'pointer',
              opacity:
                table.getSelectedRowModel().flatRows.length === 0 ? 0.5 : 1,
            }}
          >
            Deactivate
          </button>
          <button
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleActivate}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#2e7d32',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor:
                table.getSelectedRowModel().flatRows.length === 0
                  ? 'not-allowed'
                  : 'pointer',
              opacity:
                table.getSelectedRowModel().flatRows.length === 0 ? 0.5 : 1,
            }}
          >
            Activate
          </button>
          <button
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleContact}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#0288d1',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor:
                table.getSelectedRowModel().flatRows.length === 0
                  ? 'not-allowed'
                  : 'pointer',
              opacity:
                table.getSelectedRowModel().flatRows.length === 0 ? 0.5 : 1,
            }}
          >
            Contact
          </button>
        </div>
      );
    }}
  />
);

export const ToolbarAlertBannerBottom = () => (
  <DataTable
    columns={columns}
    data={data}
    enableRowSelection
    positionToolbarAlertBanner="bottom"
    renderTopToolbarCustomActions={({ table }) => {
      const handleCreateNewUser = () => {
        prompt('Create new user modal');
      };
      const handleRemoveUsers = () => {
        confirm('Are you sure you want to remove the selected users?');
      };

      return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={handleCreateNewUser}
            title="Create New User"
            style={{ padding: '0.5rem', cursor: 'pointer' }}
          >
            <PlusSquare size={20} />
          </button>
          <button
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleRemoveUsers}
            title="Remove Users"
            style={{
              padding: '0.5rem',
              cursor:
                table.getSelectedRowModel().flatRows.length === 0
                  ? 'not-allowed'
                  : 'pointer',
              opacity:
                table.getSelectedRowModel().flatRows.length === 0 ? 0.5 : 1,
            }}
          >
            <Trash2 size={20} />
          </button>
        </div>
      );
    }}
  />
);

export const ToolbarAlertBannerBottomWithActionsAlsoBottom = () => (
  <DataTable
    columns={columns}
    data={data}
    enableRowSelection
    positionToolbarAlertBanner="bottom"
    renderBottomToolbarCustomActions={({ table }) => {
      const handleCreateNewUser = () => {
        prompt('Create new user modal');
      };
      const handleRemoveUsers = () => {
        confirm('Are you sure you want to remove the selected users?');
      };

      return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={handleCreateNewUser}
            title="Create New User"
            style={{ padding: '0.5rem', cursor: 'pointer' }}
          >
            <PlusSquare size={20} />
          </button>
          <button
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleRemoveUsers}
            title="Remove Users"
            style={{
              padding: '0.5rem',
              cursor:
                table.getSelectedRowModel().flatRows.length === 0
                  ? 'not-allowed'
                  : 'pointer',
              opacity:
                table.getSelectedRowModel().flatRows.length === 0 ? 0.5 : 1,
            }}
          >
            <Trash2 size={20} />
          </button>
        </div>
      );
    }}
  />
);

export const renderCustomTopToolbar = () => (
  <DataTable
    columns={columns}
    data={data}
    renderTopToolbar={() => (
      <div style={{ padding: '2rem' }}>Custom Top Toolbar</div>
    )}
  />
);

export const renderCustomBottomToolbar = () => (
  <DataTable
    columns={columns}
    data={data}
    renderBottomToolbar={() => (
      <div style={{ padding: '2rem' }}>Custom Bottom Toolbar</div>
    )}
  />
);
