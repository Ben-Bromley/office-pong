import clsx from 'clsx';
import { FC } from 'react';

interface Props {
  children: JSX.Element | JSX.Element[] | string;
  className?: string;
}

const SectionCard: FC<Props> = ({ children, className }) => {
  return <section className={clsx('bg-white m-2 p-4 rounded-xl shadow-md', className)}>{children}</section>;
};

export default SectionCard;
