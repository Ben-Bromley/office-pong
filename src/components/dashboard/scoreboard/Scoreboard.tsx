import { FC } from 'react';
import { trpc } from '../../../utils/trpc';
import clsx from 'clsx';
import SkeletonLoader from '../../shared/SkeletonLoader';
import Tooltip from '../../shared/Tooltip';
import ScoreboardItem from './ScoreboardItem';
import { Info } from 'lucide-react';
import SectionCard from '../../shared/SectionCard';
import Leaders from './Leaders';

const Scoreboard: FC = () => {
  const scoreboard = trpc.useQuery(['user.scoreboard']);

  return (
    <SectionCard>
      <Leaders />
      <div className="w-full px-4 py-2 rounded-md flex flex-row justify-between mb-1 bg-gradient-to-b from-[#fAfCfE] to-slate-50 dark:from-slate-900 dark:to-slate-900">
        <div className="flex">
          <span
            className={clsx('mr-2 self-center text-center text-sm font-bold w-5 text-gray-900 dark:text-slate-700')}
          >
            #
          </span>
          <p className="mx-2 font-semibold text-gray-900 dark:text-slate-700">Name</p>
        </div>
        <div className="flex flex-row">
          <h2 className="text-md font-bold self-center mr-1 text-gray-900 dark:text-slate-700">ELO</h2>
          <Tooltip
            className="w-3 h-3 self-center"
            content={'The ELO rating system is a method for calculating the relative skill of a player'}
            contentClassName="-left-28 -top-14 w-60 text-center"
          >
            <Info className="w-full h-full" />
          </Tooltip>
        </div>
      </div>

      <ul className="max-h-[32.25em] relative overflow-y-auto overflow-x-hidden">
        {scoreboard.status === 'loading' && <SkeletonLoader rows={5} className="mt-2" />}
        {scoreboard.data?.map((player, idx) => (
          <ScoreboardItem key={player.id} idx={idx} player={player} />
        ))}
      </ul>
    </SectionCard>
  );
};

export default Scoreboard;
