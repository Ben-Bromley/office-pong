import { FC } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { trpc } from '../../../utils/trpc';
import SkeletonLoader from '../../shared/SkeletonLoader';
import SectionTitle from '../../shared/SectionTitle';
import Insights from './Insights';
import SectionCard from '../../shared/SectionCard';

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
    <SectionCard>
      <div className="flex flex-row justify-between">
        <SectionTitle title={<>📈 &nbsp;{playerName.split(' ')[0] ?? ''} - Stats</>} />
        {session?.user?.id === playerId && (
          <div className="flex flex-row text-end w-full justify-end">
            <a className="text-sm font-normal text-gray-400 cursor-pointer" onClick={() => signOut()}>
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

      <div className="border-b border-slate-100 my-3.5" />
      <Insights playerId={playerId} />
    </SectionCard>
  );
};

export default StatsCard;
