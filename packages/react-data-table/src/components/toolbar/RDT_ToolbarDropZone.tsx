import { type HTMLAttributes, useEffect, useRef } from 'react';
import { type RDT_RowData, type RDT_TableInstance } from '../../types';
import styles from './toolbar.module.css';

export interface RDT_ToolbarDropZoneProps<TData extends RDT_RowData>
  extends HTMLAttributes<HTMLDivElement> {
  table: RDT_TableInstance<TData>;
}

export const RDT_ToolbarDropZone = <TData extends RDT_RowData>({
  table,
  ...rest
}: RDT_ToolbarDropZoneProps<TData>) => {
  const {
    getState,
    options: { enableGrouping, localization },
    setShowToolbarDropZone,
  } = table;
  const { draggingColumn, grouping, hoveredColumn, showToolbarDropZone } =
    getState();

  // Track the previous dragging state to detect changes
  const prevDraggingColumnRef = useRef(draggingColumn);

  // Automatically show/hide drop zone when dragging state changes
  useEffect(() => {
    // Only update if dragging state actually changed (to avoid overriding user-set initial state)
    if (prevDraggingColumnRef.current !== draggingColumn) {
      prevDraggingColumnRef.current = draggingColumn;
      setShowToolbarDropZone(
        !!enableGrouping &&
          !!draggingColumn &&
          draggingColumn.columnDef.enableGrouping !== false &&
          !grouping.includes(draggingColumn.id),
      );
    }
  }, [enableGrouping, draggingColumn, grouping]);

  const isVisible = showToolbarDropZone && enableGrouping;
  const isHovering = hoveredColumn?.id === 'drop-zone';

  const dropZoneClassName = [
    styles.dropZone,
    !isVisible && styles.dropZoneHidden,
    isHovering && styles.dropZoneActive,
  ]
    .filter(Boolean)
    .join(' ');

  const handleDragEnter = () => {
    table.setHoveredColumn({ id: 'drop-zone' });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className={dropZoneClassName}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      {...rest}
    >
      {localization.dropToGroupBy.replace(
        '{column}',
        draggingColumn?.columnDef?.header ?? '',
      )}
    </div>
  );
};
