import { FC } from 'react';
import Head from 'next/head';

interface Props {
	title: string;
	description?: string;
	children?: JSX.Element | React.ReactNode;
}

const CustomHead: FC<Props> = ({ title, description, children }) => {
	return (
		<Head>
			<title>{title}</title>
			<meta name='description' content={description ?? 'Office Pong'} />
			<link rel='icon' href='/favicon.ico' />
			{children}
		</Head>
	);
};

export default CustomHead;
