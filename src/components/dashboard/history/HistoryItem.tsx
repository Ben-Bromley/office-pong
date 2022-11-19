import { Match } from '@prisma/client';
import clsx from 'clsx';
import { Info } from 'lucide-react';
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
    <li className={clsx('px-4 py-3 flex justify-between mb-0 border-b border-gray-100 rounded-sm')}>
      <div className="flex">
        <div
          className={clsx(
            'pb-0.5 rounded-none relative',
            match.playerOneScore > match.playerTwoScore && 'bg-gradient-to-bl from-emerald-300 to-emerald-400'
          )}
        >
          <p className="font-normal bg-white justify-between ml-[-1px] mr-[-1px] mt-[-1px]">
            {match.playerOneScore > match.playerTwoScore && '🏅 '}
            {playerName(match.playerOneId)}
          </p>
        </div>

        <span className={clsx('px-2 self-center text-xs text-gray-400 font-light')}>vs.</span>

        <div
          className={clsx(
            'pb-0.5 rounded-none relative',
            match.playerTwoScore > match.playerOneScore && 'bg-gradient-to-bl from-emerald-300 to-emerald-400'
          )}
        >
          <p className="font-normal bg-white justify-between ml-[-1px] mr-[-1px] mt-[-1px]">
            {match.playerTwoScore > match.playerOneScore && '🏅 '}
            {playerName(match.playerTwoId)}
          </p>
        </div>
      </div>
      <div className="flex flex-row">
        <p className={clsx('font-normal text-end px-1 rounded-md')}>
          {match.playerOneScore} - {match.playerTwoScore}
        </p>
        <Tooltip
          className="w-3 h-3 self-center"
          content={`${new Date(match.createdAt).toDateString()} - ${new Date(match.createdAt).toLocaleTimeString()}`}
          contentClassName="-left-[10.8rem] -top-2.5 w-[10.5rem]"
        >
          <Info className="w-full h-full" />
        </Tooltip>
      </div>
    </li>
  );
};

export default HistoryItem;
