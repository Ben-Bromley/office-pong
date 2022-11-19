import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import { FC, useState } from 'react';
import CountUp from 'react-countup';
import StatsCard from '../stats/StatsCard';

interface Player {
  id: string;
  name: string | null;
  matchesPlayed: number;
  matchesWon: number;
  elo: number;
}

interface Props {
  player: Player;
  idx: number;
}

const ScoreboardItem: FC<Props> = ({ player, idx }) => {
  const { data: session } = useSession();
  const [playerStatId, setPlayerStatId] = useState<string | null>(null);

  return (
    <li
      key={player.id}
      className={clsx('px-4 py-2.5 flex justify-between mb-0 border-b border-gray-100 rounded-sm relative')}
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
              className="w-2 h-2 rounded-full bg-sky-200 text-xs cursor-default self-center ml-2 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-sky-100  to-blue-100"
              onMouseEnter={() => setPlayerStatId(player.id)}
              onMouseLeave={() => setPlayerStatId(null)}
            />
          )}
        </div>
      </div>
      <div className="flex flex-row">
        <p
          className={clsx(
            'font-normal text-end px-1 rounded-md',
            idx === 0 && 'animate-text bg-gradient-to-r from-yellow-400 via-amber-200 to-yellow-400 ',
            session?.user?.id === player.id && 'font-semibold'
          )}
        >
          {idx === 0 ? <CountUp end={player.elo} duration={1.2} /> : player.elo}
        </p>
      </div>
      {playerStatId === player.id && (
        <div
          className={clsx('absolute top-[2.7rem] left-0 w-full z-50 border border-gray-100 rounded-md bg-white')}
          onMouseEnter={() => setPlayerStatId(player.id)}
          onMouseLeave={() => setPlayerStatId(null)}
        >
          <StatsCard playerId={player.id} playerName={player.name ?? ''} />
        </div>
      )}
    </li>
  );
};

export default ScoreboardItem;
