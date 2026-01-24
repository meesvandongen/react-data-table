import { type ReactNode, type RefObject } from 'react';
import {
  OverlayArrow,
  Tooltip as AriaTooltip,
  TooltipTrigger,
} from 'react-aria-components';
import styles from './tooltip.module.css';

export interface RDT_TooltipProps {
  children: ReactNode;
  content: ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  closeDelay?: number;
  isDisabled?: boolean;
  triggerRef?: RefObject<HTMLElement | null>;
}

export const RDT_Tooltip = ({
  children,
  content,
  placement = 'top',
  delay = 700,
  closeDelay = 0,
  isDisabled,
}: RDT_TooltipProps) => {
  if (!content || isDisabled) {
    return <>{children}</>;
  }

  return (
    <TooltipTrigger delay={delay} closeDelay={closeDelay}>
      <>{children}</>
      <AriaTooltip className={styles.tooltip} placement={placement}>
        <OverlayArrow className={styles.tooltipArrow}>
          <svg width={8} height={8} viewBox="0 0 8 8">
            <path d="M0 0 L4 4 L8 0" />
          </svg>
        </OverlayArrow>
        <span className={styles.tooltipContent}>{content}</span>
      </AriaTooltip>
    </TooltipTrigger>
  );
};
