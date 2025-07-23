import clsx from 'clsx';
import { FC, useState } from 'react';
import { trpc } from '../../../utils/trpc';
import { ChevronLeft, ChevronRight, FileClock, History } from 'lucide-react';
import SectionTitle from '../../shared/SectionTitle';
import SkeletonLoader from '../../shared/SkeletonLoader';
import SectionCard from '../../shared/SectionCard';
import HistoryItem from './HistoryItem';
import ELOChart from './ELOChart';
import { useSession } from 'next-auth/react';

const MatchHistory: FC = () => {
  const { data: session } = useSession();
  const [page, setPage] = useState(1);
  const matches = trpc.useQuery(['match.getAll', { page }]);
  const [screen, setScreen] = useState<'history' | 'elo'>('history');

  return (
    <SectionCard>
      <div className="flex flex-row justify-between">
        <SectionTitle icon={<FileClock />} title="Game History" />
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
          <div className="w-full px-4 py-2 rounded-md flex flex-row justify-between mb-1 bg-gradient-to-b from-[#fAfCfE] to-slate-50 dark:from-slate-900 dark:to-slate-900">
            <div className="flex">
              <p className="font-semibold text-gray-900 dark:text-slate-700">Players</p>
            </div>
            <h2 className="font-semibold text-gray-900 dark:text-slate-700 self-center mr-1">Score</h2>
          </div>
          <ul className="max-h-56 overflow-y-scroll overflow-x-hidden">
            {matches.status === 'loading' && <SkeletonLoader rows={5} className="mt-2" />}
            {matches.data?.map((match) => (
              <HistoryItem key={match.id} match={match} />
            ))}
          </ul>

          {/* Pagination */}
          {/* <div className="flex flex-row justify-between">
            <ChevronLeft
              className={clsx('cursor-pointer text-gray-300', page === 1 && 'opacity-20 cursor-auto')}
              onClick={() => setPage((p) => p - 1)}
            />
            <ChevronRight
              className={clsx(
                'cursor-pointer text-gray-300',
                (matches?.data?.length || 0) < 30 && 'opacity-20 cursor-auto'
              )}
              onClick={() => setPage((p) => p + 1)}
            />
          </div> */}
        </>
      )}

      {screen === 'elo' && (
        <div className="w-full">
          <div className="h-56 -ml-4 mt-2">
            <ELOChart userId={session?.user?.id ?? ''} />
          </div>
        </div>
      )}
    </SectionCard>
  );
};

export default MatchHistory;

/* <div className="flex flex-row">
    <div className="flex flex-col w-full"></div>
    <div className="flex flex-col w-full">
      <label htmlFor={'select'} className="mb-1 text-xs text-slate-400">
        Compare Player
      </label>
      <div className="inline-block relative w-full">
        <select
          value={compareUser}
          onChange={(e) => setCompareUser(e.target.value)}
          className={clsx(
            'border text-sm rounded-sm block w-full py-1 h-8 px-2 appearance-none border-slate-300',
            compareUser === '' ? 'text-gray-400' : 'text-gray-900'
          )}
        >
          <option value="">Select Player</option>
          {users.data &&
            users.data
              .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
              .map((player) => {
                return (
                  player.id !== session?.user?.id && (
                    <option key={player.id} value={player.id} disabled={false}>
                      {player.name}
                    </option>
                  )
                );
              })}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1">
          <ChevronDown className={clsx('h-5 w-5 text-slate-300')} />
        </div>
      </div>
    </div>
  </div> */
