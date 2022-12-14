import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import { FC, useState } from 'react';
import SectionCard from '../../shared/SectionCard';
import ELOChart from '../history/ELOChart';
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
    <li className={clsx('px-4 py-3.5 flex justify-between mb-0 relative')}>
      <div className="flex">
        <NumberBadge number={idx + 1} />
        <p className="ml-4 text-gray-900 dark:text-white font-medium">{player.name}</p>
      </div>
      <div className="flex flex-row">
        <p
          className={clsx(
            'font-medium text-end px-2 rounded-xl cursor-default',
            player.id === session?.user?.id ? 'bg-blue-100 text-blue-900' : 'bg-slate-100 text-slate-700'
          )}
          onMouseEnter={() => player.id !== session?.user?.id && setPlayerStatId(player.id)}
          onMouseLeave={() => player.id !== session?.user?.id && setPlayerStatId(null)}
        >
          {player.elo}
        </p>
      </div>
      {playerStatId === player.id && (
        <div
          className="absolute left-0 w-full z-50 shadow-2xl bg-black bg-opacity-40 rounded-xl cursor-auto"
          onMouseEnter={() => setPlayerStatId(player.id)}
          onMouseLeave={() => setPlayerStatId(null)}
        >
          <StatsCard playerId={player.id} />
          <SectionCard>
            <div className="w-full">
              <div className="h-56 -ml-4 mt-2">
                <ELOChart userId={player.id ?? ''} />
              </div>
            </div>
          </SectionCard>
        </div>
      )}
    </li>
  );
};

interface NumberBadgeProps {
  number: number;
}

const NumberBadge: FC<NumberBadgeProps> = ({ number }) => {
  return (
    <div
      className={clsx(
        'w-5 h-5 pt-0.5 rounded-full text-xs text-center font-bold self-center',
        number === 1 &&
          'text-white animate-gradient bg-gradient-to-br from-yellow-600 via-yellow-300 to-yellow-500 shadow-sm shadow-yellow-100',
        number === 2 &&
          'text-white animate-gradient bg-gradient-to-br from-gray-500 via-gray-400 to-gray-500 shadow-sm shadow-gray-100',
        number === 3 &&
          'text-white animate-gradient bg-gradient-to-br from-yellow-700 via-yellow-700 to-yellow-800 shadow-sm shadow-gray-100',
        number > 3 && 'bg-slate-100 text-gray-600 dark:bg-slate-600 dark:text-gray-300'
      )}
    >
      {number}
    </div>
  );
};

export default ScoreboardItem;
