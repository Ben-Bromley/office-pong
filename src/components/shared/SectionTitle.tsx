import { FC } from 'react';

interface Props {
  title: JSX.Element | string;
}

const SectionTitle: FC<Props> = ({ title }) => {
  return <div className="text-lg self-center w-full mb-3.5 text-gray-900 font-semibold">{title}</div>;
};

export default SectionTitle;
