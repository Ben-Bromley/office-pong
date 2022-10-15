import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Head from '../components/shared/Head';
import Image from 'next/image';
import { signIn, getProviders, LiteralUnion, ClientSafeProvider } from 'next-auth/react';
import { authOptions } from './api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth';
import { FC } from 'react';
import { BuiltInProviderType } from 'next-auth/providers';
import getWelcomeMessage from '../helpers/getWelcomeMessage';

type ProviderList = Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null;
type HomePage = NextPage<InferGetServerSidePropsType<typeof getServerSideProps>>;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  const welcomeMessage = getWelcomeMessage();
  if (session) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false
      }
    };
  }

  const providers: ProviderList = await getProviders();

  return {
    props: { providers, welcomeMessage }
  };
};

const Home: HomePage = ({ providers, welcomeMessage }) => (
  <>
    <Head title={'Office Pong | Home'} />
    <main className="md:grid md:grid-cols-2">
      <section className="md:p-2 text-center h-screen flex flex-col justify-center align-center">
        <div className="fixed inset-0 bg-white bg-opacity-60 h-screen w-screen"></div>
        <div className="z-10">
          <h1 className="transition text-2xl md:text-3xl lg:text-3xl text-gray-700">🏓 Ping Pong Leaderboard</h1>
          <p>{welcomeMessage}</p>
          <div className="mt-8">
            <ProvidersList providers={providers} />
          </div>
        </div>
      </section>
      <section className="hidden md:block">
        <div className="relative h-screen">
          <Image
            className="object-cover w-full h-full"
            src="/images/side-banner.webp"
            layout="fill"
            priority
            alt="Ping pong bat and ball on table"
          />
        </div>
      </section>
    </main>
  </>
);

const ProvidersList: FC<{ providers: ProviderList }> = ({ providers }) => (
  <>
    {Object.values(providers as Record<string, ClientSafeProvider>).map((provider) => (
      <div key={provider.id}>
        <button
          onClick={() => signIn(provider.id)}
          className="font-medium w-52 mx-auto border-2 border-blue-500 m-2 p-3 rounded bg-blue-50 text-sky-600 flex justify-center items-center"
        >
          <Image src={`/images/providers/${provider.id}.png`} width={20} height={20} alt={`${provider.name} logo`} />
          <span className="ml-2">Sign in with {provider.name}</span>
        </button>
      </div>
    ))}
  </>
);

export default Home;
