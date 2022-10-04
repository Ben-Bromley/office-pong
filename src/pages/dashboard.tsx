import type { NextPage } from 'next';
import { trpc } from '../utils/trpc';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
// import components
import LoadingSpinnerScreen from '../components/loadingSpinnerScreen';
import MatchHistory from '../components/matchHistory';
import Leaderboard from '../components/leaderboard';
import NewGameForm from '../components/newGameForm';
import Head from '../components/shared/Head';
import Scoreboard from '../components/dashboard/Scoreboard';

const Dashboard: NextPage = () => {
  const users = trpc.useQuery(['user.getAll']);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== 'loading' && !session) router.push('/');
  }, [status]);

  if (status == 'loading') return <LoadingSpinnerScreen />;

  if (status == 'authenticated') {
    return (
      <>
        <Head title={'Office Pong | Dashboard'} />
        <div>
          <div className="fixed inset-0 bg-white-texture bg-repeat h-screen w-screen"></div>
          <div className="fixed inset-0 bg-white bg-opacity-60 h-screen w-screen"></div>
          <main className="absolute inset-0 p-4 max-w-5xl mx-auto h-screen flex flex-col max-h-[800px]">
            <nav className="flex justify-between items-center flex-wrap px-8 py-4">
              <h1 className="font-bold mr-4">Welcome, {session?.user?.name?.split(' ')[0]}</h1>
              <div className="flex flex-grow flex-wrap max-w-md my-2 max-w-[120px]">
                <button
                  onClick={() => signOut()}
                  className="m-1 flex-grow flex-shrink font-medium w-40 border-2 bg-white bg-opacity-50 border-blue-500 p-2 rounded text-blue-500"
                >
                  Sign Out
                </button>
              </div>
            </nav>
            <section className="md:grid grid-cols-2 flex-grow">
              <section className="bg-white shadow-md m-2 p-4 rounded-md">
                <Scoreboard />
              </section>
              <div className="flex flex-col">
                <section className="bg-white shadow-md m-2 p-4 rounded-md">
                  <NewGameForm players={users.data} />
                </section>
                <section className="bg-white shadow-md m-2 p-4 rounded-md flex-grow">
                  <MatchHistory players={users.data} />
                </section>
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
      <LoadingSpinnerScreen />
    </>
  );
};

export default Dashboard;
