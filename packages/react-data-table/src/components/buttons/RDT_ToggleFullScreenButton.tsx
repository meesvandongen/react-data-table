import { type HTMLAttributes } from 'react';
import { type RDT_RowData, type RDT_TableInstance } from '../../types';
import styles from './buttons.module.css';

export interface RDT_ToggleFullScreenButtonProps<TData extends RDT_RowData>
  extends HTMLAttributes<HTMLButtonElement> {
  table: RDT_TableInstance<TData>;
}

export const RDT_ToggleFullScreenButton = <TData extends RDT_RowData>({
  table,
  title,
  ...rest
}: RDT_ToggleFullScreenButtonProps<TData>) => {
  const {
    getState,
    options: {
      icons: { FullscreenExitIcon, FullscreenIcon },
      localization,
    },
    setIsFullScreen,
  } = table;
  const { isFullScreen } = getState();

  const handleToggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const label = title ?? localization.toggleFullScreen;

  return (
    <button
      type="button"
      className={styles.iconButton}
      aria-label={label}
      title={label}
      onClick={handleToggleFullScreen}
      {...rest}
    >
      {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
    </button>
  );
};
