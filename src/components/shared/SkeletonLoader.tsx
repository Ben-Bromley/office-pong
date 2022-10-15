import clsx from 'clsx';
import { FC } from 'react';

interface Props {
  rows: number;
  size?: number;
}

const SkeletonLoader: FC<Props> = ({ rows, size }) => {
  return (
    <div>
      {Array.from(Array(rows)).map((row) => (
        <span
          key={row}
          className={clsx(
            'block bg-gradient-to-r from-gray-100 to-gray-50 rounded-md px-4 mb-2 animate-pulse',
            size ? `py-${size}` : 'py-4'
          )}
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;

{
  /*
const SkeletonLoader = ({ rows }: { rows: number }) => {
  const loaders = [];
  for (let i = 0; i < rows; i++) {
    loaders.push(<span key={i} className="block bg-gray-100 rounded-md px-4 py-4 mb-2 animate-pulse" />)
  }
  return (<div>{loaders}</div>)
}

export default SkeletonLoader */
}
