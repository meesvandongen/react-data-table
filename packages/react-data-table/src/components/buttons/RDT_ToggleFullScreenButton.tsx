import { ToggleButton } from 'react-aria-components';
import { type RDT_RowData, type RDT_TableInstance } from '../../types';
import { RDT_Tooltip } from '../tooltip/RDT_Tooltip';
import styles from './buttons.module.css';

export interface RDT_ToggleFullScreenButtonProps<TData extends RDT_RowData> {
  table: RDT_TableInstance<TData>;
  title?: string;
}

export const RDT_ToggleFullScreenButton = <TData extends RDT_RowData>({
  table,
  title,
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

  const handleToggleFullScreen = (isSelected: boolean) => {
    setIsFullScreen(isSelected);
  };

  const label = title ?? localization.toggleFullScreen;

  const buttonClassName = [
    styles.iconButton,
    isFullScreen && styles.iconButtonActive,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <RDT_Tooltip content={label}>
      <ToggleButton
        className={buttonClassName}
        aria-label={label}
        isSelected={isFullScreen}
        onChange={handleToggleFullScreen}
      >
        {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
      </ToggleButton>
    </RDT_Tooltip>
  );
};
