# react-data-table

A fully featured, accessible React table component built on TanStack Table v8 and React Aria Components.

## Features

- ✅ Built on TanStack Table v8 - Powerful, headless table logic
- ✅ React Aria Components - Accessible UI primitives
- ✅ TypeScript - Full type safety
- ✅ CSS Modules - Scoped, maintainable styles
- ✅ Minimal design - shadcn-inspired aesthetic with CSS variables
- ✅ 40+ Features - Sorting, filtering, pagination, virtualization, and more

## Installation

```bash
npm install react-data-table lucide-react react-aria-components
```

## Quick Start

```tsx
import { useDataTable, DataTable } from 'react-data-table';
import 'react-data-table/styles.css';

function MyTable() {
  const columns = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
  ];

  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ];

  const table = useDataTable({
    columns,
    data,
  });

  return <DataTable table={table} />;
}
```

## License

MIT
