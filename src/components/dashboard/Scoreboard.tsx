import { FC } from 'react';
import { trpc } from '../../utils/trpc';
import CountUp from 'react-countup';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';
import LoadingSpinner from '../shared/LoadingSpinner';

const Scoreboard: FC = () => {
  const scoreboard = trpc.useQuery(['user.scoreboard']);
  const { data: session } = useSession();

  return (
    <section className="bg-white m-2 p-4 rounded-md">
      <h2 className="text-lg font-bold self-center mb-4">🏓 &nbsp;Scoreboard</h2>

      <div className="w-full px-4 py-2 bg-slate-50 rounded-md flex flex-row justify-between mb-2">
        <div className="flex">
          <span className={clsx('mr-2 self-center w-4 text-center text-sm font-bold')}>#</span>
          <p className="mx-2 font-semibold">Name</p>
        </div>
        <h2 className="text-md font-bold self-center mr-1">ELO</h2>
      </div>

      <ul className="max-h-[36rem] overflow-scroll relative">
        {scoreboard.status === 'loading' && <LoadingSpinner />}
        {scoreboard.data?.map((player, idx) => (
          <li
            key={player.id}
            className={clsx('px-4 py-3 flex justify-between mb-0 border-b border-gray-100 rounded-sm')}
          >
            <div className="flex">
              <span className={clsx('mr-2 self-center w-4 text-center', idx === 0 ? 'text-md' : 'text-xs')}>
                {idx === 0 ? '🏆' : `#${idx + 1}`}
              </span>
              <p className={clsx('mx-2', session?.user?.id === player.id ? 'font-semibold' : 'font-normal')}>
                {player.name}
              </p>
            </div>
            <div className="flex flex-row">
              <p
                className={clsx(
                  'font-normal text-end px-1 rounded-md',
                  idx === 0 && 'bg-gradient-to-tr from-yellow-100 via-yellow-300 to-yellow-100',
                  session?.user?.id === player.id && 'font-semibold'
                )}
              >
                {idx === 0 ? <CountUp end={player.elo} duration={1.2} /> : player.elo}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Scoreboard;
