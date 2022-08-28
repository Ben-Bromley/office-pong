import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { trpc } from "../utils/trpc";
import { useSession, signIn, getProviders, signOut } from "next-auth/react"

const Home: NextPage<any> = ({ providers }) => {
  // const users = trpc.useQuery(["user.getAll"]);
  // if (users && !users.isLoading) console.log(users.data);

  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>Office Pong | Home</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="md:grid md:grid-cols-2">
        <section className="md:p-2 text-center h-screen flex flex-col justify-center align-center">
          <div className="fixed inset-0 bg-white-texture bg-repeat h-screen w-screen"></div>
          <div className="fixed inset-0 bg-white bg-opacity-60 h-screen w-screen"></div>
          <div className="z-10">
            <h1 className="transition text-2xl md:text-3xl text-gray-700">🏓 Ping Pong Leaderboard</h1>
            <p>Yep, it's finally done!</p>
            <div className="mt-8">
              {!session && (<>
                {/* <Link href="/register">
                  <button className="font-medium w-32 border-2 border-blue-500 m-2 p-2 rounded text-blue-500">
                    Register
                  </button>
                </Link>

                <Link href="/api/auth/signin">
                  <button className="font-medium w-32 border-2 border-blue-500 m-2 p-2 rounded bg-blue-500 text-white hover:bg-blue-600">
                    Login
                  </button>
                </Link> */}
                <>
                  {Object.values(providers).map((provider: any) => (
                    <div key={provider.name}>
                      <button onClick={() => signIn(provider.id)} className="font-medium w-52 mx-auto border-2 border-blue-500 m-2 p-3 rounded bg-blue-50 text-sky-600 flex justify-center items-center">
                        <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2048px-Google_%22G%22_Logo.svg.png" width={20} height={20} />
                        <span className="ml-2">Sign in with {provider.name}</span>
                      </button>
                    </div>
                  ))}
                </>
              </>)}
              {session && (
                <div>
                  <p>Logged in as {session?.user?.name || "..."}</p>
                  <Link href="/dashboard">
                    <button className="font-medium w-48 border-2 border-blue-500 m-2 p-2 rounded bg-blue-500 text-white hover:bg-blue-600">
                      Go To Dashboard
                    </button>
                  </Link>
                  <button onClick={() => signOut()} className="font-medium w-48 border-2 border-blue-500 m-2 p-2 rounded text-blue-500">
                    Sign Out
                  </button>
                </div>
              )}

            </div>
          </div>
        </section>
        <section className="hidden md:block">
          <div className="relative h-screen">
            <Image src="/images/pingpong.jpg" layout="fill" objectFit="cover" priority />
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;

export async function getServerSideProps(context:any) {
  const providers = await getProviders()
  return {
    props: { providers },
  }
}