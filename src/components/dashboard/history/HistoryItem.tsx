import { Match } from '@prisma/client';
import clsx from 'clsx';
import { FC } from 'react';
import { trpc } from '../../../utils/trpc';
import Tooltip from '../../shared/Tooltip';

interface Props {
  match: Match;
}

const HistoryItem: FC<Props> = ({ match }) => {
  const users = trpc.useQuery(['user.getAll']);
  const playerName = (id: string) => users.data?.find((u) => u.id === id)?.name;

  return (
    <li className={clsx('px-2 py-3.5 flex justify-between mb-0 relative')}>
      <div className="flex">
        {match.playerOneScore > match.playerTwoScore ? (
          <p className="font-medium text-end px-2 rounded-xl bg-lime-100 text-green-700 cursor-default">
            {playerName(match.playerOneId)}
          </p>
        ) : (
          <p className="text-gray-900 dark:text-white font-medium">{playerName(match.playerOneId)}</p>
        )}
        <span className={clsx('px-2 self-center text-xs text-gray-400 font-light')}>vs.</span>
        {match.playerTwoScore > match.playerOneScore ? (
          <p className="font-medium text-end px-2 rounded-xl bg-lime-100 text-green-700 cursor-default">
            {playerName(match.playerTwoId)}
          </p>
        ) : (
          <p className="text-gray-900 dark:text-white font-medium">{playerName(match.playerTwoId)}</p>
        )}
      </div>
      <div>
        <Tooltip
          content={`${new Date(match.createdAt).toDateString()} - ${new Date(match.createdAt).toLocaleTimeString()}`}
          contentClassName="-left-[11.5rem] -top-1 w-auto"
        >
          <p className="font-medium text-end px-2 rounded-xl bg-slate-100 text-slate-700 cursor-default">
            {match.playerOneScore} - {match.playerTwoScore}
          </p>
        </Tooltip>
      </div>
    </li>
  );
};

export default HistoryItem;
