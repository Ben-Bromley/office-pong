import clsx from 'clsx';
import { AlertTriangle, BarChart, BarChart3, ChevronLeft, ChevronRight, Triangle, Trophy } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { FC, useState } from 'react';
import { trpc } from '../../../utils/trpc';

interface Props {
  playerId: string;
}

const Insights: FC<Props> = ({ playerId }) => {
  const { data: session } = useSession();
  const [idx, setIdx] = useState<number>(0);
  const insights = trpc.useQuery(['user.insights', { id: playerId }]);

  if (insights.status === 'loading') {
    return <></>;
  }

  const MostLosses = () => (
    <>
      <div className="flex flex-row text-sm items-center">
        <AlertTriangle className="w-4 h-4 text-red-500" />
        <p className="ml-2 font-normal"> Most losses to {insights.data?.mostLossUser?.name}!</p>
      </div>
    </>
  );

  const MostWins = () => (
    <>
      <div className="flex flex-row text-sm items-center">
        <Trophy className="w-4 h-4 text-amber-500" />
        <p className="ml-2 font-normal"> Most wins against {insights.data?.mostWinUser?.name}!</p>
      </div>
    </>
  );

  const EloChange = () => (
    <>
      {insights?.data?.eloChange !== null ? (
        <div className="flex flex-row text-sm items-center">
          <BarChart3 className={clsx('w-4 h-4', insights.data!.eloChange > 0 ? 'text-sky-600' : 'text-sky-600')} />
          <p className="ml-2 font-normal">
            {' '}
            ELO has {insights.data!.eloChange > 0 ? 'risen' : 'fallen'} by{' '}
            {insights.data?.eloChange ?? 0 > 0 ? '+' : ''}
            {insights.data?.eloChange} since 5 games ago!
          </p>
        </div>
      ) : (
        <div className="flex flex-row text-sm items-center">
          <BarChart3 className="w-4 h-4 text-gray-500" />
          <p className="ml-2 font-normal"> Play at least 5 games to show your ELO change</p>
        </div>
      )}
    </>
  );

  return (
    <div className="flex w-full flex-row ">
      <div className="w-full">
        {idx === 0 && <MostLosses />}
        {idx === 1 && <MostWins />}
        {idx === 2 && <EloChange />}
      </div>
      <div className="flex flex-row justify-between self-end">
        <ChevronLeft
          className={clsx('cursor-pointer text-gray-300', idx === 0 && 'opacity-20 cursor-auto')}
          onClick={() => idx !== 0 && setIdx((i: number) => i - 1)}
        />
        <ChevronRight
          className={clsx('cursor-pointer text-gray-300', idx === 2 && 'opacity-20 cursor-auto')}
          onClick={() => idx !== 2 && setIdx((i: number) => i + 1)}
        />
      </div>
    </div>
  );
};

export default Insights;
