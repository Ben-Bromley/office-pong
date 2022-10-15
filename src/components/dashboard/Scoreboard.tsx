import { FC, useState } from 'react';
import { trpc } from '../../utils/trpc';
import CountUp from 'react-countup';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';
import SkeletonLoader from '../shared/SkeletonLoader';
import StatsCard from './StatsCard';

const Scoreboard: FC = () => {
  const scoreboard = trpc.useQuery(['user.scoreboard']);
  const { data: session } = useSession();
  const [playerStatId, setPlayerStatId] = useState('');

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
        {scoreboard.status === 'loading' && <SkeletonLoader rows={3} />}
        {scoreboard.data?.map((player, idx) => (
          <li
            key={player.id}
            className={clsx('px-4 py-3 flex justify-between mb-0 border-b border-gray-100 rounded-sm relative')}
          >
            <div className="flex">
              <span className={clsx('mr-2 self-center w-4 text-center', idx === 0 ? 'text-md' : 'text-xs')}>
                {idx === 0 ? '🏆' : `#${idx + 1}`}
              </span>
              <div className="flex flex-row">
                <p className={clsx('ml-2', session?.user?.id === player.id ? 'font-semibold' : 'font-normal')}>
                  {player.name}
                </p>
                {player.id !== session?.user?.id && (
                  <div
                    className="w-2 h-2 rounded-full bg-green-200 text-xs cursor-default self-center ml-2 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-red-100  to-yellow-100"
                    onMouseEnter={() => setPlayerStatId(player.id)}
                    onMouseLeave={() => setPlayerStatId('')}
                  ></div>
                )}
              </div>
            </div>
            <div className="flex flex-row">
              <p
                className={clsx(
                  'font-normal text-end px-1 rounded-md',
                  idx === 0 && 'bg-gradient-to-tr from-yellow-300 via-yellow-200 to-yellow-300',
                  session?.user?.id === player.id && 'font-semibold'
                )}
              >
                {idx === 0 ? <CountUp end={player.elo} duration={1.2} /> : player.elo}
              </p>
            </div>
            {playerStatId === player.id && (
              <div
                className={clsx('absolute top-[2.98rem] left-0 w-full z-50 border border-gray-100 rounded-md bg-white')}
              >
                <StatsCard playerId={player.id} playerName={player.name ?? ''} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Scoreboard;
