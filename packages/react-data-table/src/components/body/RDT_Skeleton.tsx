import clsx from 'clsx';
import styles from '../table/table.module.css';

export interface RDT_SkeletonProps {
  width?: number | string;
  className?: string;
}

export const RDT_Skeleton = ({ width, className }: RDT_SkeletonProps) => {
  return (
    <span
      className={clsx(styles.skeleton, className)}
      style={{ width: width ?? '100%' }}
      aria-hidden="true"
    />
  );
};
