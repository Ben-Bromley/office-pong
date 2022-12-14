import clsx from 'clsx';
import { AlignStartVertical, Crown, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';

const Sidebar: FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { pathname } = useRouter();

  // toggle tailwind dark mode
  const toggleDarkMode = () => {
    const html = document.querySelector('html');
    html?.classList.toggle('dark');
    setDarkMode(!darkMode);
  };

  return (
    <div className="w-12 h-32 bg-teal-400 shadow-md my-auto rounded-xl">
      <ul className="flex flex-col text-center p-2 h-full justify-between">
        <li
          className={clsx(
            'self-center p-2 rounded-lg cursor-pointer',
            pathname === '/dashboard' && 'bg-teal-300 cursor-default'
          )}
        >
          <Link href="/dashboard">
            <Crown className="w-5 h-5 text-white" />
          </Link>
        </li>
        <li
          className={clsx(
            'self-center p-2 rounded-lg cursor-pointer',
            pathname === '/tournament' && 'bg-rose-200 cursor-default'
          )}
        >
          <Link href="/tournament">
            <AlignStartVertical className="w-5 h-5 text-white" />
          </Link>
        </li>
        <li className={clsx('self-center p-2 rounded-lg cursor-pointer')} onClick={() => toggleDarkMode()}>
          {darkMode ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
