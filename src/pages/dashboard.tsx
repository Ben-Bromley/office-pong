import type { NextPage } from 'next';
import { trpc } from '../utils/trpc';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
// import components
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Head from '../components/shared/Head';
import Scoreboard from '../components/dashboard/Scoreboard';
import NewGameForm from '../components/dashboard/NewGameForm';
import Navigation from '../components/dashboard/Navigation';
import StatsCard from '../components/dashboard/StatsCard';
import MatchHistory from '../components/dashboard/MatchHistory';

const Dashboard: NextPage = () => {
  const users = trpc.useQuery(['user.getAll']);
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
          <div className="fixed inset-0 bg-slate-200 bg-repeat h-screen w-screen"></div>
          <div className="fixed inset-0 bg-white bg-opacity-60 h-screen w-screen"></div>
          <div className="fixed inset-0 h-screen w-screen bg-banner-texture"></div>
          <div className="fixed inset-0 h-screen w-screen bg-banner-polka"></div>
          {/* <div className="h-[1000px] w-[200%] absolute top-[-712px] rotate-[-14deg] left-[-25%] bg-gradient-to-t from-[transparent] to-[#a2a5acc0]"></div> */}
          <main className="absolute inset-0 p-4 max-w-5xl mx-auto h-screen flex flex-col max-h-[800px] py-4">
            <section className="md:grid grid-cols-2 flex-grow">
              <Scoreboard />
              <div className="flex flex-col xl:md:lg:border-l xl:md:lg:ml-1 border-slate-200 xl:md:lg:pl-1">
                <StatsCard />
                <NewGameForm />
                <MatchHistory />
              </div>
            </section>
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
