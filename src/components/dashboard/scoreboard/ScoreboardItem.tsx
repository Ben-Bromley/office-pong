import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import { FC, useState } from 'react';
import CountUp from 'react-countup';
import StatsCard from '../stats/StatsCard';
import { Player } from '../../../types/types';

export const RANK_EMOJIS: Record<string, string> = {
  Poop: '💩',
  Mythical: '🧙‍♂️',
  Legendary: '🦁',
  Diamond: '💎',
  Stone: '🪨',
  Platinum: '⚪',
  Gold: '🥇',
  Silver: '🥈',
  Bronze: '🥉',
  Wood: '🌲',
  Papyrus: '📜',
};

interface Props {
  player: Player;
  idx: number;
  rank: string;
}

const ScoreboardItem: FC<Props> = ({ player, idx, rank }) => {
  const { data: session } = useSession();
  const [playerStatId, setPlayerStatId] = useState<string | null>(null);

  return (
    <li key={player.id} className={clsx('px-4 py-2.5 flex justify-between mb-0 border-b border-gray-100  relative')}>
      <div className="flex">
        <span className={clsx('mr-2 self-center w-4 text-center font-light', idx === 0 ? 'text-md' : 'text-xs')}>
          {idx === 0 ? RANK_EMOJIS[rank] : `#${idx + 1}`}
        </span>
        <div className="flex flex-row">
          <p className={clsx('ml-2', session?.user?.id === player.id ? 'font-semibold' : 'font-normal')}>
            {player.name}
          </p>
          {player.id !== session?.user?.id && (
            <div
              className="w-2 h-2 rounded-full bg-sky-200 text-xs cursor-default self-center ml-2 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-gray-200  to-blue-100"
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
            idx === 0 &&
              'animate-gradient bg-gradient-to-br from-yellow-500 via-amber-200 to-yellow-400 shadow-sm shadow-yellow-100',
            session?.user?.id === player.id && 'font-semibold'
          )}
        >
          {idx === 0 ? <CountUp end={player.elo} duration={0.9} /> : player.elo}
        </p>
      </div>
      {playerStatId === player.id && (
        <div
          className={clsx('absolute left-0 w-full z-50 shadow-2xl bg-black bg-opacity-60 rounded-md')}
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
