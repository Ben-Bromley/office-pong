import { FC } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { trpc } from '../../../utils/trpc';
import SkeletonLoader from '../../shared/SkeletonLoader';
import SectionTitle from '../../shared/SectionTitle';
import Insights from './Insights';
import SectionCard from '../../shared/SectionCard';
import { Activity, AlertTriangle, FilePieChart, Joystick, LogOut, PieChart, Trophy } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  playerId: string;
}

const StatsCard: FC<Props> = ({ playerId }) => {
  const { data: session } = useSession();
  const stats = trpc.useQuery(['user.stats', { id: playerId }]);

  if (stats.status === 'loading') {
    return (
      <SectionCard>
        <SkeletonLoader rows={4} size={3} />
      </SectionCard>
    );
  }

  return (
    <SectionCard>
      <div className="flex flex-row justify-between">
        <SectionTitle icon={<FilePieChart />} title="Player Stats" />
        {session?.user?.id === playerId && (
          <div className="flex flex-row text-end w-full justify-end">
            <a className="text-xs font-normal text-blue-400 cursor-pointer" title="Sign out" onClick={() => signOut()}>
              <LogOut className="w-4 h-4 self-center" />
            </a>
          </div>
        )}
      </div>

      <div className="flex flex-row mb-6 justify-around">
        <StatItem
          title={'Matches Played'}
          value={stats.data?.matchesPlayed || 0}
          gradient="bg-gradient-to-bl from-gray-50 to-gray-200"
          icon={<Joystick />}
        />
        <StatItem
          title={'Win Percentage'}
          value={
            stats.data?.matchesPlayed
              ? Math.round(((stats.data?.matchesWon || 0) / stats.data?.matchesPlayed) * 100) + '%'
              : 0
          }
          gradient="bg-gradient-to-br from-cyan-50 to-blue-100"
          icon={<Activity />}
        />
        <StatItem
          title={'Matches Won'}
          value={stats.data?.matchesWon || 0}
          gradient="bg-gradient-to-bl from-green-50 to-green-100"
          icon={<Trophy />}
        />
        <StatItem
          title={'Matches Lost'}
          value={(stats.data?.matchesPlayed || 0) - (stats.data?.matchesWon || 0)}
          gradient="bg-gradient-to-tr from-rose-50 to-red-100"
          icon={<AlertTriangle />}
        />
      </div>
      <Insights playerId={playerId} />
    </SectionCard>
  );
};

interface StatItemProps {
  title: string;
  value: number | string;
  icon: JSX.Element;
  gradient: string;
}

const StatItem: FC<StatItemProps> = ({ title, value, gradient, icon }) => {
  return (
    <div className="w-1/4 mr-1.5">
      <div className={clsx('flex flex-col p-2.5 text-sm rounded-lg', gradient)}>
        <div className="flex flex-row justify-between">
          <p className="font-semibold text-gray-900 text-2xl">{value}</p>
          <icon.type className="w-5 h-5 text-gray-900 self-center" />
        </div>
        <p className="font-medium mt-2 text-gray-800 text-sm">{title}</p>
      </div>
    </div>
  );
};

export default StatsCard;
