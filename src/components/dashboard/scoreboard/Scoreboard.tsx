import { FC } from 'react';
import { trpc } from '../../../utils/trpc';
import clsx from 'clsx';
import SkeletonLoader from '../../shared/SkeletonLoader';
import Tooltip from '../../shared/Tooltip';
import ScoreboardItem from './ScoreboardItem';
import SectionTitle from '../../shared/SectionTitle';
import { Info } from 'lucide-react';

const Scoreboard: FC = () => {
  const scoreboard = trpc.useQuery(['user.scoreboard']);

  return (
    <section className="bg-white m-2 p-4 rounded-md shadow-sm">
      <SectionTitle title="🏓 &nbsp;Scoreboard" />
      <div className="w-full px-4 py-2 bg-slate-50 rounded-md flex flex-row justify-between mb-1.5">
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
        {scoreboard.data?.map((player, idx) => (
          <ScoreboardItem key={player.id} idx={idx} player={player} />
        ))}
      </ul>
    </section>
  );
};

export default Scoreboard;
