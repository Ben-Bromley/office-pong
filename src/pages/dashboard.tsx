import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Head from '../components/shared/Head';
import Scoreboard from '../components/dashboard/scoreboard/Scoreboard';
import NewGameForm from '../components/dashboard/NewGameForm';
import StatsCard from '../components/dashboard/stats/StatsCard';
import MatchHistory from '../components/dashboard/history/MatchHistory';
import Sidebar from '../components/dashboard/ui/Sidebar';

const Dashboard: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'unauthenticated') {
    router.push('/');
    return null;
  }

  if (status === 'loading') return <LoadingSpinner />;

  return (
    <>
      <Head title={'Office Pong | Dashboard'} />
      <div>
        <div className="fixed inset-0 bg-slate-200 bg-repeat h-screen w-screen dark:bg-slate-900" />
        <div className="fixed inset-0 h-screen w-screen bg-banner-texture" />
        <div className="fixed inset-0 h-screen w-screen bg-banner-polka" />
        <main className="absolute inset-0 max-w-5xl mx-auto max-h-[800px] h-screen py-2">
          <div className="flex flex-row mx-auto w-full justify-between">
            {/* <Sidebar /> */}
            <div className="w-12 h-32"></div>
            <div className="flex flex-row w-full mx-auto ml-3">
              <div className="flex flex-col w-full sm:w-full md:w-1/2">
                <div className="flex flex-col flex-grow w-full">
                  <Scoreboard />
                </div>
              </div>
              <div className="flex flex-col w-full sm:w-full md:w-1/2">
                <div className="flex flex-col flex-grow w-full">
                  <NewGameForm />
                  <StatsCard playerId={session?.user?.id ?? ''} />
                  <MatchHistory />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
