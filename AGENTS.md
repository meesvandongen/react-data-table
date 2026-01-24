# AGENTS.md - Guidelines for AI Coding Agents

This document provides guidelines for AI agents working on **React Data Table (RDT)** - a framework-agnostic table library built with React Aria Components and CSS variables.

## Project Goal

We are building `react-data-table` (RDT) as a new package. The `material-react-table` (MRT) package exists as a **reference implementation** for feature parity - do not modify MRT unless explicitly asked.

## Project Structure

```
packages/
  react-data-table/       # RDT - What we're building (RDT_ prefix)
  material-react-table/   # MRT - Reference only, do not modify
apps/
  material-react-table-docs/  # Documentation site (reference only)
```

## Build & Development Commands

```bash
pnpm i                                            # Install all dependencies
pnpm --filter react-data-table build              # Build with rslib
pnpm --filter react-data-table typecheck          # TypeScript check
pnpm --filter react-data-table storybook          # Dev server on port 6007
pnpm --filter react-data-table storybook:build    # Build Storybook
pnpm --filter react-data-table test               # Run all tests
pnpm --filter react-data-table test <pattern>     # Run single test file
pnpm --filter react-data-table test:ui            # Vitest UI
pnpm format                                       # Format all files with Prettier
```

## Code Style Guidelines

### Formatting (Prettier)
- **Print width**: 80 characters
- **Semicolons**: Always required
- **Quotes**: Single quotes
- **Trailing commas**: All (including function parameters)

### TypeScript Configuration
- **Strict mode**: Enabled
- **No unused locals/parameters**: Enforced
- **No implicit returns**: Enforced
- **No fallthrough cases in switch**: Enforced

### Import Order (enforced by eslint-plugin-perfectionist)
Imports must be sorted in this order with NO blank lines between groups:
1. `react`, `react-*` packages
2. `@tanstack/**` packages
3. Internal `./RDT_*` components
4. Sibling imports (`./`)
5. Parent imports (`../`)
6. Style imports

### Type Imports
Always use inline type imports:
```typescript
// Correct
import { type ReactNode, useState } from 'react';
import { type RDT_RowData, type RDT_TableInstance } from '../../types';

// Incorrect
import type { ReactNode } from 'react';
import { RDT_RowData } from '../../types';
```

### Naming Conventions

- Components: `RDT_ComponentName` (e.g., `RDT_TableBody`, `RDT_TableHeadCell`)
- Types: `RDT_TypeName` (e.g., `RDT_RowData`, `RDT_TableInstance`)
- Hooks: `useRDT_HookName` (e.g., `useRDT_ColumnVirtualizer`)
- Files: `RDT_ComponentName.tsx`
- CSS modules: `component.module.css`
- Stories: `FeatureName.stories.tsx`

### Component Patterns

**Generic table components** use `TData extends RDT_RowData`:
```typescript
export const RDT_TableBody = <TData extends RDT_RowData>({
  table,
  ...rest
}: RDT_TableBodyProps<TData>) => {
  // ...
};
```

**Props interfaces** extend HTML element attributes:
```typescript
export interface RDT_TableProps<TData extends RDT_RowData>
  extends HTMLAttributes<HTMLTableElement> {
  table: RDT_TableInstance<TData>;
}
```

### CSS & Styling

RDT uses **CSS modules** with **CSS custom properties** (no runtime CSS-in-JS).

```typescript
import styles from './table.module.css';
import clsx from 'clsx';

<table className={clsx(styles.table, className)} />
```

**CSS Variables** (defined in `src/variables.css`):
- HSL tokens: `--rdt-background`, `--rdt-foreground`, `--rdt-border`
- Functional colors: `--rdt-base-background-color`, `--rdt-border-color`
- Layout: `--rdt-cell-padding`, `--rdt-border-radius`, `--rdt-density`

All functional variables must be defined in both `:root` and `.dark` sections.

### Icons

RDT uses `lucide-react` via the `icons` prop. Icon names (from `src/icons.tsx`):
- `ArrowDownwardIcon`, `SortIcon`, `ArrowRightIcon`
- `ChevronLeftIcon`, `ChevronRightIcon`, `ExpandMoreIcon`
- `FilterAltIcon`, `SearchIcon`, `EditIcon`, `SaveIcon`
- `DragHandleIcon`, `PushPinIcon`, `FullscreenIcon`
- `KeyboardDoubleArrowDownIcon`, `MoreVertIcon`, `CancelIcon`

### Error Handling
- Use optional chaining (`?.`) for potentially undefined values
- Provide sensible defaults with nullish coalescing (`??`)
- Use `parseFromValuesOrFunc` utility for props that can be values or functions

## Testing

Uses **Vitest** with jsdom environment:
```bash
pnpm --filter react-data-table test                    # Run all tests
pnpm --filter react-data-table test src/utils          # Run tests in folder
pnpm --filter react-data-table test filterFns.test     # Run specific test
```

## Storybook Stories

Stories are in `packages/react-data-table/stories/`:
- `features/` - Feature demonstrations (Sorting, Filtering, Selection, etc.)
- `styling/` - Styling examples (Theming, Dimensions, etc.)
- `fixed-bugs/` - Bug reproduction/verification stories

## Common Pitfalls

1. **Icon names**: Check `src/icons.tsx` for correct icon names before using.
2. **CSS variables**: Must be defined in `variables.css` for both `:root` and `.dark`.
3. **Import order**: ESLint will warn if imports are not sorted correctly.
4. **Type imports**: Always use inline `type` keyword for type-only imports.
5. **MRT reference**: Look at MRT for feature parity, but don't copy MUI-specific code.
