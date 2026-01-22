import {
  ArrowDown,
  ArrowRight,
  ArrowUpDown,
  ChevronDown,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  ChevronsDown,
  ChevronsLeft,
  ChevronsRight,
  Columns3,
  Copy,
  EyeOff,
  Filter,
  FilterX,
  GripVertical,
  Maximize,
  Minimize,
  MoreHorizontal,
  MoreVertical,
  Pencil,
  Pin,
  RefreshCcw,
  RotateCcw,
  Save,
  Search,
  SearchX,
  Trash2,
  X,
} from 'lucide-react';
import { forwardRef, type SVGProps } from 'react';

// Custom SVG icons for density
const DensityLargeIcon = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref) => (
    <svg
      ref={ref}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
);
DensityLargeIcon.displayName = 'DensityLargeIcon';

const DensityMediumIcon = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref) => (
    <svg
      ref={ref}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="3" y1="7" x2="21" y2="7" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="17" x2="21" y2="17" />
    </svg>
  ),
);
DensityMediumIcon.displayName = 'DensityMediumIcon';

const DensitySmallIcon = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref) => (
    <svg
      ref={ref}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="3" y1="8" x2="21" y2="8" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="16" x2="21" y2="16" />
    </svg>
  ),
);
DensitySmallIcon.displayName = 'DensitySmallIcon';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RDT_Icons = Record<string, any>;

export const RDT_Default_Icons: RDT_Icons = {
  // Sorting & Navigation
  ArrowDownwardIcon: ArrowDown,
  ArrowRightIcon: ArrowRight,
  SortIcon: ArrowUpDown,

  // Pagination
  ChevronLeftIcon: ChevronLeft,
  ChevronRightIcon: ChevronRight,
  ChevronLeftPipeIcon: ChevronFirst,
  ChevronRightPipeIcon: ChevronLast,
  FirstPageIcon: ChevronsLeft,
  LastPageIcon: ChevronsRight,

  // Expansion
  ExpandMoreIcon: ChevronDown,
  KeyboardDoubleArrowDownIcon: ChevronsDown,

  // Actions
  CancelIcon: X,
  CloseIcon: X,
  EditIcon: Pencil,
  SaveIcon: Save,
  ClearAllIcon: Trash2,
  RestartAltIcon: RotateCcw,
  SyncAltIcon: RefreshCcw,

  // Filtering
  FilterAltIcon: Filter,
  FilterListIcon: Filter,
  FilterListOffIcon: FilterX,
  SearchIcon: Search,
  SearchOffIcon: SearchX,

  // Columns & Layout
  ViewColumnIcon: Columns3,
  VisibilityOffIcon: EyeOff,

  // Dragging & Pinning
  DragHandleIcon: GripVertical,
  PushPinIcon: Pin,

  // Fullscreen
  FullscreenIcon: Maximize,
  FullscreenExitIcon: Minimize,

  // Menus
  MoreHorizIcon: MoreHorizontal,
  MoreVertIcon: MoreVertical,

  // Copy
  ContentCopyIcon: Copy,

  // Density (custom icons)
  DensityLargeIcon,
  DensityMediumIcon,
  DensitySmallIcon,
} as const;
