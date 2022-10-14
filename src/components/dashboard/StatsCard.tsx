import { FC } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { trpc } from '../../utils/trpc';

const StatsCard: FC = () => {
  const { data: session } = useSession();
  const stats = trpc.useQuery(['user.stats', { id: session!.user!.id }]);

  return (
    <section className="bg-white m-2 p-4 rounded-md">
      <div className="flex flex-row justify-between mb-4">
        <h2 className="text-lg font-bold self-center w-full">
          📈 &nbsp;{session?.user?.name?.split(' ')[0] ?? ''} - Stats
        </h2>
        <div className="flex flex-row text-end w-full justify-end">
          <a className="text-sm font-normal text-blue-500 cursor-pointer" onClick={() => signOut()}>
            Sign Out
          </a>
        </div>
      </div>

      <div className="flex flex-row">
        <div className="flex flex-row mb-2 text-sm w-full">
          <p className="font-normal text-white rounded-md px-1.5 bg-gradient-to-bl from-indigo-300 to-purple-400">
            {stats.data?.matchesPlayed}
          </p>
          <p className="ml-2 font-normal">Total Games Played</p>
        </div>

        <div className="flex flex-row mb-2 text-sm w-full">
          <p className="font-normal text-white px-1.5 rounded-md bg-gradient-to-bl from-blue-500 to-blue-600">
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
          <p className="font-normal text-white px-1.5 rounded-md bg-gradient-to-bl from-emerald-500 to-lime-600">
            {stats.data?.matchesWon}
          </p>
          <p className="ml-2 font-normal">Games Won </p>
        </div>
        <div className="flex flex-row mb-2 text-sm w-full">
          <p className="font-normal text-white px-1.5 rounded-md bg-gradient-to-bl from-red-500 to-red-600">
            {(stats.data?.matchesPlayed || 0) - (stats.data?.matchesWon || 0)}
          </p>
          <p className="ml-2 font-normal">Games Lost </p>
        </div>
      </div>
      <div className="border-b border-slate-100 my-4" />
      <div className="flex flex-row text-sm items-center">
        <p className="font-normal border-b-2 border-red-600">{stats.data?.fearedOpponent}</p>
        <p className="ml-2 font-normal"> - Hardest Opponent</p>
      </div>
    </section>
  );
};

export default StatsCard;
