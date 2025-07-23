import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Head from '../components/shared/Head';
import Sidebar from '../components/dashboard/ui/Sidebar';
import SectionCard from '../components/shared/SectionCard';
import Brackets from '../components/tournament/Brackets';

const Tournament: NextPage = () => {
  const { status } = useSession();
  const router = useRouter();

  if (status === 'unauthenticated') {
    router.push('/');
    return null;
  }

  if (status === 'loading') return <LoadingSpinner />;

  return (
    <>
      <Head title={'Office Pong | Tournament'} />
      <div>
        <div className="fixed inset-0 bg-slate-200 bg-repeat h-screen w-screen dark:bg-slate-900"></div>
        <div className="fixed inset-0 h-screen w-screen bg-banner-texture"></div>
        <div className="fixed inset-0 h-screen w-screen bg-banner-polka"></div>
        <main className="absolute inset-0 max-w-5xl mx-auto max-h-[800px] h-screen py-2">
          <div className="flex flex-row mx-auto w-full justify-start">
            <Sidebar />
            <div className="flex flex-row w-full ml-3 bg-red">
              <SectionCard>
                Tournament
                <Brackets />
              </SectionCard>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Tournament;
