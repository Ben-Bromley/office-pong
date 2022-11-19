import clsx from 'clsx';
import { FC } from 'react';

interface Props {
  children: JSX.Element | JSX.Element[];
  className?: string;
}

const SectionCard: FC<Props> = ({ children, className }) => {
  return <section className={clsx('bg-white m-2 p-4 rounded-md shadow-sm', className)}>{children}</section>;
};

export default SectionCard;
