/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { Crown } from 'lucide-react';
import { FC } from 'react';
import CountUp from 'react-countup';
import { trpc } from '../../../utils/trpc';
import SectionCard from '../../shared/SectionCard';

const Leaders: FC = () => {
  const scoreboard = trpc.useQuery(['user.scoreboard']);

  const getUserInitials = (name: string) => {
    const names = name.split(' ');
    const initials = names.map((n) => n[0]);
    return initials.join('');
  };

  return (
    <>
      <div className="flex flex-row flex-grow justify-evenly align-middle mb-4 mt-2">
        {/*  */}
        <div className="mx-auto">
          <div className="w-20 h-20 rounded-full border-4 border-gray-300 flex items-center justify-center relative mx-auto shadow-lg shadow-gray-100 dark:shadow-none">
            <div className="w-16 h-16 rounded-full bg-slate-50">
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-600">
                {getUserInitials(scoreboard.data?.[1]?.name ?? '??')}
              </div>
            </div>
            <div className="absolute -bottom-2 font-semibold text-end px-2 rounded-xl text-white bg-gray-400">
              <CountUp end={scoreboard.data?.[1]?.elo || 0} duration={1} />
            </div>
          </div>
          <p className="w-full pt-2.5 font-medium text-center text-gray-900 dark:text-white">
            {scoreboard.data?.[1]?.name ?? ''}
          </p>
        </div>

        <div className="mx-auto">
          <Crown className="w-7 h-7 justify-self-center mx-auto text-amber-300" />
          <div className="w-20 h-20 rounded-full border-4 border-amber-300 flex items-center justify-center relative mx-auto shadow-lg shadow-amber-200 dark:shadow-none">
            <div className="w-16 h-16 rounded-full bg-slate-50">
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-600">
                {getUserInitials(scoreboard.data?.[0]?.name ?? '??')}
              </div>
            </div>
            <div className="absolute -bottom-2 font-semibold text-end px-2 rounded-xl bg-amber-400 text-white">
              <CountUp end={scoreboard.data?.[0]?.elo || 0} duration={1} />
            </div>
          </div>
          <p className="w-full pt-2.5 font-medium text-center text-gray-900 dark:text-white">
            {scoreboard.data?.[0]?.name ?? ''}
          </p>
        </div>

        <div className="mx-auto">
          <div className="w-20 h-20 rounded-full border-4 border-bronze-300 flex items-center justify-center self-end relative mx-auto shadow-lg shadow-amber-100 dark:shadow-none">
            <div className="w-16 h-16 rounded-full bg-slate-50">
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-600">
                {getUserInitials(scoreboard.data?.[2]?.name ?? '??')}
              </div>
            </div>
            <div className="absolute -bottom-2 font-semibold text-end px-2 rounded-xl bg-bronze-400 text-white">
              <CountUp end={scoreboard.data?.[2]?.elo || 0} duration={1} />
            </div>
          </div>
          <p className="w-full pt-2.5 font-medium text-center text-gray-900 dark:text-white">
            {scoreboard.data?.[2]?.name ?? ''}
          </p>
        </div>
      </div>
    </>
  );
};

export default Leaders;
