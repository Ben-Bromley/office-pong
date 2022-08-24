import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Register: NextPage = () => {

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
            <form className="mt-4 p-6 bg-white max-w-xs mx-auto rounded overflow-hidden">
                <input className="min-w-full border p-2 rounded-md mb-2" required type="text" name="username" id="username" placeholder="Name" />
                <input className="min-w-full border p-2 rounded-md mb-2" required type="email" name="email" id="email" placeholder="Email" />
                <input className="min-w-full border p-2 rounded-md mb-2" required type="password" name="password" id="password" placeholder="Password" />
                <input className="min-w-full border p-2 rounded-md mb-2" required type="confirmpassword" name="confirmpassword" id="confirmpassword" placeholder="Confirm Password" />
                <div>
                  <input type="submit" value="Create Account" className="font-medium w-full border-2 border-blue-500 mt-2 p-2 rounded bg-blue-500 text-white hover:bg-blue-600" />
                  <p className="mt-4 text-sm">Already have an account? <a href="/login" className="font-medium text-blue-500 hover:text-blue-700">Login</a></p>
                </div>
            </form>
          </div>
          <a href="/" className="text-white hover:text-blue-300 mx-auto text-sm">Return To Home</a>
        </section>

      </main>
    </>
  );
};

export default Register;
