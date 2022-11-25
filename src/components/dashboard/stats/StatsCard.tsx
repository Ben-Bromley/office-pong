import { FC } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { trpc } from '../../../utils/trpc';
import SkeletonLoader from '../../shared/SkeletonLoader';
import SectionTitle from '../../shared/SectionTitle';
import Insights from './Insights';
import SectionCard from '../../shared/SectionCard';
import { Activity, AlertTriangle, Joystick, LogOut, Trophy } from 'lucide-react';
import clsx from 'clsx';

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
            <a className="text-xs font-normal text-blue-400 cursor-pointer" title="Sign out" onClick={() => signOut()}>
              <LogOut className="w-4 h-4 self-center" />
            </a>
          </div>
        )}
      </div>

      <div className="flex flex-row mb-6">
        <StatItem
          title={'Matches Played'}
          value={stats.data?.matchesPlayed || 0}
          gradient="bg-gradient-to-bl from-gray-200 via-white to-gray-100"
          icon={<Joystick className="w-5 h-5 text-black self-center" />}
        />
        <StatItem
          title={'Win Percentage'}
          value={
            stats.data?.matchesPlayed
              ? Math.round(((stats.data?.matchesWon || 0) / stats.data?.matchesPlayed) * 100) + '%'
              : 0
          }
          gradient="bg-gradient-to-br from-sky-200 via-white to-sky-100"
          icon={<Activity className="w-5 h-5 text-black self-center" />}
        />
        <StatItem
          title={'Matches Won'}
          value={stats.data?.matchesWon || 0}
          gradient="bg-gradient-to-br from-lime-200 via-white to-white"
          icon={<Trophy className="w-5 h-5 text-black self-center" />}
        />
        <StatItem
          title={'Matches Lost'}
          value={(stats.data?.matchesPlayed || 0) - (stats.data?.matchesWon || 0)}
          gradient="bg-gradient-to-tr from-red-200 via-white to-white"
          icon={<AlertTriangle className="w-5 h-5 text-black self-center" />}
        />
      </div>
      <Insights playerId={playerId} />
    </SectionCard>
  );
};

interface StatItemProps {
  title: string;
  value: number | string;
  icon?: JSX.Element;
  gradient: string;
}

const StatItem: FC<StatItemProps> = ({ title, value, gradient, icon }) => {
  return (
    <div className={clsx('flex flex-col p-2 text-sm w-1/4 rounded-xl mr-4 shadow-sm', gradient)}>
      <div className="flex flex-row justify-between">
        <p className="font-semibold text-black text-2xl">{value}</p>
        {icon}
      </div>
      <p className="font-semibold mt-2 text-black">{title}</p>
    </div>
  );
};

export default StatsCard;
