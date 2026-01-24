import { type HTMLAttributes } from 'react';
import {
  type RDT_Header,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import { RDT_FilterTextField } from './RDT_FilterTextField';
import { RDT_FilterTimeField } from './RDT_FilterTimeField';
import styles from './inputs.module.css';

export interface RDT_FilterRangeFieldsProps<TData extends RDT_RowData>
  extends HTMLAttributes<HTMLDivElement> {
  header: RDT_Header<TData>;
  isTime?: boolean;
  table: RDT_TableInstance<TData>;
}

export const RDT_FilterRangeFields = <TData extends RDT_RowData>({
  header,
  isTime,
  table,
  className,
  ...rest
}: RDT_FilterRangeFieldsProps<TData>) => {
  return (
    <div
      {...rest}
      className={[styles.filterRangeContainer, className]
        .filter(Boolean)
        .join(' ')}
    >
      {isTime ? (
        // For time range, render two time fields
        <>
          <RDT_FilterTimeField header={header} table={table} />
          <RDT_FilterTimeField header={header} table={table} />
        </>
      ) : (
        // For other ranges, render two text fields
        [0, 1].map((rangeFilterIndex) => (
          <RDT_FilterTextField
            header={header}
            key={rangeFilterIndex}
            rangeFilterIndex={rangeFilterIndex}
            table={table}
          />
        ))
      )}
    </div>
  );
};
