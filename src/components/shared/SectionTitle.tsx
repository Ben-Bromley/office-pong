import clsx from 'clsx';
import { FC } from 'react';

interface Props {
  icon: JSX.Element;
  title: JSX.Element | string;
}

const SectionTitle: FC<Props> = ({ title, icon }) => {
  return (
    <div className="flex flex-row justify-start w-full mb-3.5">
      <icon.type className="w-5 h-5 self-center text-black-800 dark:text-white" />
      <p className="text-black-800 dark:text-white self-center text-md font-medium ml-2">{title}</p>
    </div>
  );
};

export default SectionTitle;

// font-size: 1.125rem/* 18px */;
// line-height: 1.75rem/* 2
