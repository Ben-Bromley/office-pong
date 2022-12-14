import clsx from 'clsx';
import { FC, useState } from 'react';

interface Props {
  content: JSX.Element | string;
  children: JSX.Element;
  className?: string;
  contentClassName?: string;
}

const Tooltip: FC<Props> = ({ content, children, className, contentClassName }) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className={clsx('relative', className)}
      >
        {show && (
          <div className={clsx('absolute z-100 bg-black text-white rounded-lg p-2', contentClassName)}>
            <p className="text-xs">{content}</p>
          </div>
        )}
        {children}
      </div>
    </>
  );
};

export default Tooltip;
