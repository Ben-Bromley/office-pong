import clsx from 'clsx';
import { FC } from 'react';

interface Props {
  children: any;
  className?: string;
}

const SectionCard: FC<Props> = ({ children, className }) => {
  return (
    <section
      className={clsx(
        'bg-white dark:bg-slate-800 m-2 p-4 rounded-xl border border-slate-100 shadow-md dark:border-slate-800',
        className
      )}
    >
      {children}
    </section>
  );
};

export default SectionCard;
