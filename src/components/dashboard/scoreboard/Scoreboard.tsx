import { FC } from 'react';
import { trpc } from '../../../utils/trpc';
import clsx from 'clsx';
import SkeletonLoader from '../../shared/SkeletonLoader';
import Tooltip from '../../shared/Tooltip';
import ScoreboardItem from './ScoreboardItem';
import SectionTitle from '../../shared/SectionTitle';
import { Info } from 'lucide-react';
import SectionCard from '../../shared/SectionCard';
import groupByRank from '../../../helpers/groupByRank';
import CollapsibleSection from '../../shared/CollapsableSection';

const RANK_COLORS: Record<string, string> = {
  Mythical: 'from-purple-700 to-indigo-500',
  Legendary: 'from-yellow-500 to-orange-400',
  Diamond: 'from-cyan-500 to-blue-400',
  Stone: 'from-stone-400 to-stone-300',
  Platinum: 'from-slate-400 to-slate-300',
  Gold: 'from-yellow-400 to-yellow-300',
  Silver: 'from-gray-300 to-gray-200',
  Bronze: 'from-orange-400 to-amber-300',
  Wood: 'from-amber-700 to-amber-600',
  // Low-saturation cloth/beige gradient for Papyrus
  Papyrus: 'from-[#d9cbb4] to-[#cbbfa3]',
  Poop: 'from-amber-900 to-orange-800',
};


const Scoreboard: FC = () => {
  const scoreboard = trpc.useQuery(['user.scoreboard']);

  return (
    <SectionCard>
      <SectionTitle title="🏓 &nbsp;Scoreboard" />
      <div className="w-full px-4 py-2 rounded-md flex flex-row justify-between mb-1 bg-gradient-to-b from-[#fAfCfE] to-slate-50">
        <div className="flex">
          <span className={clsx('mr-2 self-center w-4 text-center text-sm font-bold')}>#</span>
          <p className="mx-2 font-semibold">Name</p>
        </div>
        <div className="flex flex-row">
          <h2 className="text-md font-bold self-center mr-1">ELO</h2>
          <Tooltip
            className="w-3 h-3 self-center"
            content={'The ELO rating system is a method for calculating the relative skill of a player'}
            contentClassName="-left-28 -top-14 w-60 text-center"
          >
            <Info className="w-full h-full" />
          </Tooltip>
        </div>
      </div>

      <ul className="max-h-[40em] relative overflow-y-auto overflow-x-hidden">
        {scoreboard.status === 'loading' && <SkeletonLoader rows={3} />}

        {scoreboard.data && (
          <>
            {Object.entries(groupByRank(scoreboard.data)).reverse().map(([rank, players]) =>
              players.length > 0 ? (
                <CollapsibleSection key={rank} title={rank} color={RANK_COLORS[rank]}>
                  {players.map((player, idx) => (
                    <ScoreboardItem key={player.id} idx={idx} player={player} rank={rank}/>
                  ))}
                </CollapsibleSection>
              ) : null
            )}
          </>
        )}
      </ul>
    </SectionCard>
  );
};

export default Scoreboard;
