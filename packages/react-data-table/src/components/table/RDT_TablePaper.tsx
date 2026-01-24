import {
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react';
import clsx from 'clsx';
import { type RDT_RowData, type RDT_TableInstance } from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { RDT_BottomToolbar } from '../toolbar/RDT_BottomToolbar';
import { RDT_TopToolbar } from '../toolbar/RDT_TopToolbar';
import { RDT_TableContainer } from './RDT_TableContainer';
import styles from './table.module.css';

export interface RDT_TablePaperProps<TData extends RDT_RowData>
  extends HTMLAttributes<HTMLDivElement> {
  table: RDT_TableInstance<TData>;
}

export const RDT_TablePaper = <TData extends RDT_RowData>({
  table,
  className,
  style,
  ...rest
}: RDT_TablePaperProps<TData>) => {
  const {
    getState,
    options: {
      enableBottomToolbar,
      enableTopToolbar,
      renderBottomToolbar,
      renderTopToolbar,
      tablePaperProps,
    },
    refs: { tablePaperRef },
  } = table;
  const { density, isFullScreen } = getState();

  const paperProps = {
    ...parseFromValuesOrFunc(tablePaperProps, { table }),
    ...rest,
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      table.setIsFullScreen(false);
    }
    paperProps?.onKeyDown?.(e);
  };

  return (
    <div
      {...paperProps}
      ref={(ref) => {
        tablePaperRef.current = ref;
        if (typeof paperProps?.ref === 'function') {
          paperProps.ref(ref);
        } else if (paperProps?.ref) {
          (
            paperProps.ref as React.MutableRefObject<HTMLDivElement | null>
          ).current = ref;
        }
      }}
      data-density={density}
      className={clsx(
        'rdt-table-container',
        styles.tablePaper,
        isFullScreen && styles.tablePaperFullscreen,
        paperProps?.className,
        className,
      )}
      style={
        {
          ...paperProps?.style,
          ...style,
        } as CSSProperties
      }
      onKeyDown={handleKeyDown}
    >
      {enableTopToolbar &&
        (parseFromValuesOrFunc(renderTopToolbar, { table }) ?? (
          <RDT_TopToolbar table={table} />
        ))}
      <RDT_TableContainer table={table} />
      {enableBottomToolbar &&
        (parseFromValuesOrFunc(renderBottomToolbar, { table }) ?? (
          <RDT_BottomToolbar table={table} />
        ))}
    </div>
  );
};
