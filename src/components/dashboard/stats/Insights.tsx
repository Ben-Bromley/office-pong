import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
        <div className="bg-gradient-to-r from-gray-700 via-gray-900 to-black pb-0.5 rounded-none relative">
          <p className="font-normal bg-white justify-between ml-[-1px] mr-[-1px] mt-[-1px]">
            {insights.data?.mostLossUser?.name}
          </p>
        </div>
        <p className="ml-2 font-normal">- Lost to the most</p>
      </div>
    </>
  );

  const MostWins = () => (
    <>
      <div className="flex flex-row text-sm items-center">
        <div className="bg-gradient-to-r from-gray-700 via-gray-900 to-black pb-0.5 rounded-none relative">
          <p className="font-normal bg-white justify-between ml-[-1px] mr-[-1px] mt-[-1px]">
            {insights.data?.mostWinUser?.name}
          </p>
        </div>
        <p className="ml-2 font-normal">- Most beaten</p>
      </div>
    </>
  );

  const EloChange = () => (
    <>
      <div className="flex flex-row text-sm items-center">
        {insights?.data?.eloChange !== null ? (
          <>
            <div className="bg-gradient-to-r from-gray-700 via-gray-900 to-black pb-0.5 rounded-none relative">
              <p className="font-normal bg-white justify-between ml-[-1px] mr-[-1px] mt-[-1px]">
                {insights.data?.eloChange ?? 0 > 0 ? '+' : ''}
                {insights.data?.eloChange}
              </p>
            </div>
            <p className="ml-2 font-normal">- Your ELO change since 5 games ago</p>
          </>
        ) : (
          <p className="font-normal">Not enough games played to calculate ELO change</p>
        )}
      </div>
    </>
  );

  return (
    <div className="flex w-full flex-row ">
      <div className="w-full">
        {idx === 0 && <MostLosses />}
        {idx === 1 && <MostWins />}
        {idx === 2 && <EloChange />}
      </div>
      {playerId === session?.user?.id && (
        <div className="flex flex-row justify-between self-end">
          <ChevronLeft
            className={clsx('cursor-pointer text-gray-400', idx === 0 && 'opacity-10')}
            onClick={() => idx !== 0 && setIdx((i: number) => i - 1)}
          />
          <ChevronRight
            className={clsx('cursor-pointer text-gray-400', idx === 2 && 'opacity-10')}
            onClick={() => idx !== 2 && setIdx((i: number) => i + 1)}
          />
        </div>
      )}
    </div>
  );
};

export default Insights;
