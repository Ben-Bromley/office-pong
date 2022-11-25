/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { Crown } from 'lucide-react';
import { FC } from 'react';
import CountUp from 'react-countup';
import { trpc } from '../../../utils/trpc';
import SectionCard from '../../shared/SectionCard';
import SectionTitle from '../../shared/SectionTitle';

const Leaders: FC = () => {
  const scoreboard = trpc.useQuery(['user.scoreboard']);

  const getUserInitials = (name: string) => {
    const names = name.split(' ');
    const initials = names.map((n) => n[0]);
    return initials.join('');
  };

  return (
    <SectionCard>
      <SectionTitle title="🏆 &nbsp;Champions" />
      <div className="flex flex-row flex-grow justify-evenly align-middle mb-4">
        <div className="w-20 h-20 rounded-full border-4 border-gray-400 flex items-center justify-center self-end relative">
          <div className="w-16 h-16 rounded-full bg-gray-50">
            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
              {getUserInitials(scoreboard.data?.[1]?.name ?? '??')}
            </div>
          </div>
          <div className="absolute -bottom-2 font-semibold text-end px-2 rounded-xl text-white bg-gray-400">
            <CountUp end={scoreboard.data?.[1]?.elo || 0} duration={1} />
          </div>
        </div>
        <div className="">
          <Crown className="w-6 h-6 justify-self-center mx-auto text-yellow-400" />
          <div className="w-24 h-24 rounded-full border-4 border-yellow-400 flex items-center justify-center relative">
            <div className="w-20 h-20 rounded-full bg-gray-50">
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
                {getUserInitials(scoreboard.data?.[0]?.name ?? '??')}
              </div>
            </div>
            <div className="absolute -bottom-3 font-semibold text-end px-2 rounded-xl bg-yellow-400 text-white">
              <CountUp end={scoreboard.data?.[0]?.elo || 0} duration={1} />
            </div>
          </div>
        </div>
        <div className="w-20 h-20 rounded-full border-4 border-yellow-700 flex items-center justify-center self-end relative">
          <div className="w-16 h-16 rounded-full bg-gray-50">
            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
              {getUserInitials(scoreboard.data?.[2]?.name ?? '??')}
            </div>
          </div>
          <div className="absolute -bottom-3 font-semibold text-end px-2 rounded-xl bg-yellow-700 text-white">
            <CountUp end={scoreboard.data?.[2]?.elo || 0} duration={1} />
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

export default Leaders;
