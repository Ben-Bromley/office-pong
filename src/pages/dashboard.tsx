import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Head from '../components/shared/Head';
import Scoreboard from '../components/dashboard/scoreboard/Scoreboard';
import NewGameForm from '../components/dashboard/NewGameForm';
import StatsCard from '../components/dashboard/stats/StatsCard';
import MatchHistory from '../components/dashboard/history/MatchHistory';
import Leaders from '../components/dashboard/scoreboard/Leaders';

const Dashboard: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== 'loading' && !session) router.push('/');
  }, [status, router, session]);

  if (status == 'loading') return <LoadingSpinner />;

  if (status == 'authenticated') {
    return (
      <>
        <Head title={'Office Pong | Dashboard'} />
        <div>
          <div className="fixed inset-0 bg-[#d3d3df] bg-repeat h-screen w-screen"></div>
          <div className="fixed inset-0 bg-white bg-opacity-40 h-screen w-screen"></div>
          <div className="fixed inset-0 h-screen w-screen bg-banner-texture"></div>
          <div className="fixed inset-0 h-screen w-screen bg-banner-polka"></div>
          <main className="absolute inset-0 max-w-5xl mx-auto max-h-[800px] h-screen py-2">
            <div className="flex flex-row">
              <div className="flex flex-col w-1/2">
                <div className="flex flex-col flex-grow">
                  <Leaders />
                  <Scoreboard />
                </div>
              </div>
              <div className="flex flex-col w-1/2">
                <div className="flex flex-col">
                  <StatsCard playerId={session?.user?.id ?? ''} playerName={session?.user?.name ?? ''} />
                  <NewGameForm />
                  <MatchHistory />
                </div>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  // return nothing if not authenticated
  return (
    <>
      <LoadingSpinner />
    </>
  );
};

export default Dashboard;
