import clsx from 'clsx';
import { FC } from 'react';

interface Props {
  rows: number;
  size?: number;
  className?: string;
}

const SkeletonLoader: FC<Props> = ({ rows, size, className }) => {
  return (
    <div className={className}>
      {Array.from(Array(rows)).map((row, idx: number) => (
        <span
          key={idx}
          className={clsx(
            'block bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg px-4 mb-2 animate-pulse',
            size ? `py-${size}` : 'py-4'
          )}
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;
