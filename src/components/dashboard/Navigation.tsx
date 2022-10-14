import { FC } from 'react';
import { signOut } from 'next-auth/react';

interface Props {
  username: string;
}

const Navigation: FC<Props> = ({ username }) => {
  return (
    <nav className="flex justify-end items-center flex-wrap px-2 pb-2">
      <h1 className="font-bold">Welcome, {username}</h1>
      <div className="flex flex-grow flex-wrap max-w-[120px]">
        <button onClick={() => signOut()} className="text-blue-500">
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
