import { FC } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { trpc } from '../../utils/trpc';
import SkeletonLoader from '../shared/SkeletonLoader';

interface Props {
  playerId: string;
  playerName: string;
}

const StatsCard: FC<Props> = ({ playerId, playerName }) => {
  const { data: session } = useSession();
  const stats = trpc.useQuery(['user.stats', { id: playerId }]);

  if (stats.status === 'loading') {
    return (
      <section className="bg-white m-2 p-4 rounded-md">
        <SkeletonLoader rows={4} size={3} />
      </section>
    );
  }

  return (
    <section className="bg-white m-2 p-4 rounded-md">
      <div className="flex flex-row justify-between mb-4">
        <h2 className="text-lg font-bold self-center w-full">📈 &nbsp;{playerName.split(' ')[0] ?? ''} - Stats</h2>
        {session?.user?.id === playerId && (
          <div className="flex flex-row text-end w-full justify-end">
            <a className="text-sm font-normal text-blue-500 cursor-pointer" onClick={() => signOut()}>
              Sign Out
            </a>
          </div>
        )}
      </div>

      <div className="flex flex-row">
        <div className="flex flex-row mb-2 text-sm w-full">
          <p className="font-normal text-white rounded-md px-1.5 bg-gradient-to-bl from-indigo-300 to-purple-400">
            {stats.data?.matchesPlayed || 0}
          </p>
          <p className="ml-2 font-normal">Total Games Played</p>
        </div>

        <div className="flex flex-row mb-2 text-sm w-full">
          <p className="font-normal text-white px-1.5 rounded-md bg-gradient-to-bl from-blue-300 to-blue-400">
            {stats.data?.matchesPlayed
              ? Math.round(((stats.data?.matchesWon || 0) / stats.data?.matchesPlayed) * 100)
              : 0}
            %
          </p>
          <p className="ml-2 font-normal">Win Percentage </p>
        </div>
      </div>

      <div className="flex flex-row">
        <div className="flex flex-row mb-2 text-sm w-full">
          <p className="font-normal text-white px-1.5 rounded-md bg-gradient-to-bl from-emerald-300 to-emerald-400">
            {stats.data?.matchesWon || 0}
          </p>
          <p className="ml-2 font-normal">Games Won </p>
        </div>
        <div className="flex flex-row mb-2 text-sm w-full">
          <p className="font-normal text-white px-1.5 rounded-md bg-gradient-to-bl from-red-300 to-red-400">
            {(stats.data?.matchesPlayed || 0) - (stats.data?.matchesWon || 0)}
          </p>
          <p className="ml-2 font-normal">Games Lost </p>
        </div>
      </div>
      {stats.data?.fearedOpponent && (
        <>
          <div className="border-b border-slate-100 my-4" />
          <div className="flex flex-row text-sm items-center">
            <div className="bg-gradient-to-r from-gray-700 via-gray-900 to-black pb-0.5 rounded-none relative">
              <p className="font-normal bg-white justify-between ml-[-1px] mr-[-1px] mt-[-1px]">
                {stats.data?.fearedOpponent}
              </p>
            </div>
            <p className="ml-2 font-normal">- Toughest opponent</p>
          </div>
        </>
      )}
    </section>
  );
};

export default StatsCard;
