import { type HTMLAttributes } from 'react';
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
  } = table;
  const { draggingColumn, grouping, hoveredColumn, showToolbarDropZone } =
    getState();

  const isVisible = showToolbarDropZone && enableGrouping;
  const isDraggingColumn = !!draggingColumn;
  const isHovering = hoveredColumn?.id === 'drop-zone';

  const dropZoneClassName = [
    styles.dropZone,
    !isVisible && styles.dropZoneHidden,
    isHovering && styles.dropZoneActive,
  ]
    .filter(Boolean)
    .join(' ');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (isDraggingColumn) {
      table.setHoveredColumn({ id: 'drop-zone' });
    }
  };

  const handleDragLeave = () => {
    table.setHoveredColumn(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggingColumn && !grouping.includes(draggingColumn.id)) {
      table.setGrouping([...grouping, draggingColumn.id]);
    }
    table.setHoveredColumn(null);
    table.setDraggingColumn(null);
  };

  return (
    <div
      className={dropZoneClassName}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      {...rest}
    >
      {localization.dropToGroupBy}
    </div>
  );
};
