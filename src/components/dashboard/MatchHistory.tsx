import clsx from 'clsx';
import { FC } from 'react';
import { trpc } from '../../utils/trpc';
import SkeletonLoader from '../shared/SkeletonLoader';

const MatchHistory: FC = () => {
  const matches = trpc.useQuery(['match.getAll']);
  const users = trpc.useQuery(['user.getAll']);

  const playerName = (id: string) => users.data?.find((u) => u.id === id)?.name;

  return (
    <section className="bg-white m-2 p-4 rounded-md">
      <h2 className="text-lg font-bold self-center w-full mb-4">🗒 &nbsp;Match History</h2>
      <div className="w-full px-4 py-2 bg-slate-50 rounded-md flex flex-row justify-between mb-2">
        <div className="flex">
          {/* <span className={clsx('mr-2 self-center w-4 text-center text-sm font-bold')}>#</span> */}
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

              <span className={clsx('px-2 self-center text-xs text-gray-400')}>vs.</span>

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

              {/* <p
                className={clsx(
                  'font-normal',
                  match.playerTwoScore > match.playerOneScore && 'border-green-400 border-b-2'
                )}
              >
                {match.playerTwoScore > match.playerOneScore && '🏅 '}
                {playerName(match.playerTwoId)}
              </p> */}
            </div>
            <div className="flex flex-row">
              <p className={clsx('font-normal text-end px-1 rounded-md')}>
                {match.playerOneScore} - {match.playerTwoScore}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default MatchHistory;
