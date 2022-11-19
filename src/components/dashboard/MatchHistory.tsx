import clsx from 'clsx';
import { FC } from 'react';
import { trpc } from '../../utils/trpc';
import { Info } from 'lucide-react';
import SectionTitle from '../shared/SectionTitle';
import SkeletonLoader from '../shared/SkeletonLoader';
import Tooltip from '../shared/Tooltip';
import SectionCard from '../shared/SectionCard';

const MatchHistory: FC = () => {
  const matches = trpc.useQuery(['match.getAll']);
  const users = trpc.useQuery(['user.getAll']);

  const playerName = (id: string) => users.data?.find((u) => u.id === id)?.name;

  return (
    <SectionCard>
      <SectionTitle title="📅 &nbsp;Match History" />
      <div className="w-full px-4 py-2 rounded-md flex flex-row justify-between mb-1 bg-gradient-to-b from-[#fAfCfE] to-slate-50">
        <div className="flex">
          <p className="font-semibold">Players</p>
        </div>
        <h2 className="text-md font-bold self-center mr-1">Score</h2>
      </div>
      <ul className="max-h-52 overflow-scroll">
        {matches.status === 'loading' && <SkeletonLoader rows={3} />}
        {matches.data?.map((match) => (
          <li
            key={match.id}
            className={clsx('px-4 py-3 flex justify-between mb-0 border-b border-gray-100 rounded-sm')}
          >
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
                content={`${new Date(match.createdAt).toDateString()} - ${new Date(
                  match.createdAt
                ).toLocaleTimeString()}`}
                contentClassName="-left-[10.8rem] -top-2.5 w-[10.5rem]"
              >
                <Info className="w-full h-full" />
              </Tooltip>
            </div>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
};

export default MatchHistory;
