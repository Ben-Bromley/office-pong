import type { NextPage } from "next";
import Head from "next/head";
import { getCsrfToken } from "next-auth/react";

const Login: NextPage<any> = ({ csrfToken }) => {
  return (<>This Page Has Been Removed</>);
  return (
    <>
      <Head>
        <title>P3 | Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-gradient-to-br from-blue-400 to-cyan-700">
        <section className="md:p-2 text-center h-screen flex flex-col justify-center align-center">
          <div style={{ marginTop: -40 }} className="p-4">
            <h1 className="transition text-2xl md:text-3xl text-white font-medium">Register</h1>
            <form method="POST" action="/api/auth/callback/credentials" className="mt-4 p-6 bg-white max-w-xs mx-auto rounded overflow-hidden">
              <input type="hidden" name="csrfToken" defaultValue={csrfToken} />
              <input className="min-w-full border p-2 rounded-md mb-2" required type="email" name="email" id="email" placeholder="Email" />
              <input className="min-w-full border p-2 rounded-md mb-2" required type="password" name="password" id="password" placeholder="Password" />
              <div>
                <input type="submit" value="Login" className="font-medium w-full border-2 border-blue-500 mt-2 p-2 rounded bg-blue-500 text-white hover:bg-blue-600" />
                <p className="mt-4 text-sm">Don't have an account? <a href="/register" className="font-medium text-blue-500 hover:text-blue-700">Register</a></p>
              </div>
            </form>
          </div>
          <a href="/" className="text-white hover:text-blue-300 mx-auto text-sm">Return To Home</a>
        </section>

      </main>
    </>
  );
};

export default Login;

export async function getServerSideProps(context: any) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  }
}
