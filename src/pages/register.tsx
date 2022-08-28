import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { trpc } from "../utils/trpc";

type newUserData = {
  name: string;
  email: string;
  password: string;
}

const Register: NextPage = () => {
  return (<>This Page Has Been Removed</>);
  const newUserMutation = trpc.useMutation(['user.create'])

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // get data from form
    const registerForm = document.getElementById('user-registration-form') as HTMLFormElement;
    const formData = Object.fromEntries(new FormData(registerForm).entries());

    if (formData.password !== formData.confirmpassword) {
      return alert("Please Ensure Passwords Match");
    }

    // create new user data
    const newUserData: newUserData = {
      name: formData.name as string,
      email: formData.email as string,
      password: formData.password as string
    }

    newUserMutation.mutate({ ...newUserData });
    console.log(newUserMutation.data);
  }

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
            <form id="user-registration-form" onSubmit={handleSubmitForm} className="mt-4 p-6 bg-white max-w-xs mx-auto rounded overflow-hidden">
              <input className="min-w-full border p-2 rounded-md mb-2" required type="text" name="name" id="name" placeholder="Name" />
              <input className="min-w-full border p-2 rounded-md mb-2" required type="email" name="email" id="email" placeholder="Email" />
              <input className="min-w-full border p-2 rounded-md mb-2" required type="password" name="password" id="password" placeholder="Password" />
              <input className="min-w-full border p-2 rounded-md mb-2" required type="password" name="confirmpassword" id="confirmpassword" placeholder="Confirm Password" />
              <div>
                <input type="submit" value="Create Account" className="font-medium w-full border-2 border-blue-500 mt-2 p-2 rounded bg-blue-500 text-white hover:bg-blue-600" />
                <p className="mt-4 text-sm">Already have an account? <Link href="/login" className="font-medium text-blue-500 hover:text-blue-700">Login</Link></p>
              </div>
            </form>
          </div>
          <Link href="/" className="text-white hover:text-blue-300 mx-auto text-sm">Return To Home</Link>
        </section>

      </main>
    </>
  );
};

export default Register;
