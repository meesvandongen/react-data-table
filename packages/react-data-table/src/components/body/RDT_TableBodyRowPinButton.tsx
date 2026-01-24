import { type ButtonHTMLAttributes } from 'react';
import {
  type RDT_Row,
  type RDT_RowData,
  type RDT_TableInstance,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { RDT_RowPinButton } from '../buttons/RDT_RowPinButton';

export interface RDT_TableBodyRowPinButtonProps<TData extends RDT_RowData>
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  row: RDT_Row<TData>;
  table: RDT_TableInstance<TData>;
}

export const RDT_TableBodyRowPinButton = <TData extends RDT_RowData>({
  row,
  table,
  ...rest
}: RDT_TableBodyRowPinButtonProps<TData>) => {
  const {
    getState,
    options: { enableRowPinning, rowPinningDisplayMode },
  } = table;
  const { density } = getState();

  const canPin = parseFromValuesOrFunc(enableRowPinning, row as any);

  if (!canPin) return null;

  const rowPinButtonProps = {
    row,
    table,
    ...rest,
  };

  if (rowPinningDisplayMode === 'top-and-bottom' && !row.getIsPinned()) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: density === 'compact' ? 'row' : 'column',
        }}
      >
        <RDT_RowPinButton pinningPosition="top" {...rowPinButtonProps} />
        <RDT_RowPinButton pinningPosition="bottom" {...rowPinButtonProps} />
      </div>
    );
  }

  return (
    <RDT_RowPinButton
      pinningPosition={rowPinningDisplayMode === 'bottom' ? 'bottom' : 'top'}
      {...rowPinButtonProps}
    />
  );
};
