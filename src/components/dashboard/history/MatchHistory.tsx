import clsx from 'clsx';
import { FC, useState } from 'react';
import { trpc } from '../../../utils/trpc';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SectionTitle from '../../shared/SectionTitle';
import SkeletonLoader from '../../shared/SkeletonLoader';
import SectionCard from '../../shared/SectionCard';
import HistoryItem from './HistoryItem';
import ELOChart from './ELOChart';
import { useSession } from 'next-auth/react';

const MatchHistory: FC = () => {
  const { data: session } = useSession();
  const userMatches = trpc.useQuery(['match.userMatches', { id: session?.user?.id ?? null }]);
  const matches = trpc.useQuery(['match.getAll']);
  const [screen, setScreen] = useState<'history' | 'elo'>('history');

  return (
    <SectionCard>
      <div className="flex flex-row justify-between">
        <SectionTitle title="🗒 &nbsp;Match History" />
        <div className="flex flex-row justify-between">
          <ChevronLeft
            className={clsx('cursor-pointer text-gray-300', screen === 'history' && 'opacity-20 cursor-auto')}
            onClick={() => screen !== 'history' && setScreen('history')}
          />
          <ChevronRight
            className={clsx('cursor-pointer text-gray-300', screen === 'elo' && 'opacity-20 cursor-auto')}
            onClick={() => screen !== 'elo' && setScreen('elo')}
          />
        </div>
      </div>

      {screen === 'history' && (
        <>
          <div className="w-full px-4 py-2 rounded-md flex flex-row justify-between mb-1 bg-gradient-to-b from-[#fAfCfE] to-slate-50">
            <div className="flex">
              <p className="font-semibold">Players</p>
            </div>
            <h2 className="text-md font-bold self-center mr-1">Score</h2>
          </div>
          <ul className="max-h-52 overflow-y-scroll overflow-x-hidden">
            {matches.status === 'loading' && <SkeletonLoader rows={3} />}
            {matches.data?.map((match) => (
              <HistoryItem key={match.id} match={match} />
            ))}
          </ul>
        </>
      )}

      {screen === 'elo' && (
        <div className="w-full h-64">
          {/* <select className="w-full h-10 px-2 rounded-md bg-slate-50">
            <option value="all">All Players</option>
          </select> */}
          <ELOChart data={userMatches.data} />
        </div>
      )}
    </SectionCard>
  );
};

export default MatchHistory;
