import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { env } from "../../../env/server.mjs";
import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    }),
    // ...add more providers here
    // CredentialsProvider({
    //   // The name to display on the sign in form (e.g. "Sign in with...")
    //   name: "Credentials",
    //   // The credentials is used to generate a suitable form on the sign in page.
    //   // You can specify whatever fields you are expecting to be submitted.
    //   // e.g. domain, username, password, 2FA token, etc.
    //   // You can pass any HTML attribute to the <input> tag through the object.
    //   credentials: {
    //     email: { label: "Email", type: "text", placeholder: "john@doe.com" },
    //     password: {  label: "Password", type: "password" }
    //   },
    //   async authorize(credentials, req) {
    //     // Add logic here to look up the user from the credentials supplied
    //     // const user = { id: 1, name: "J Smith", email: "jsmith@example.com" }
    //     const user = prismaClient.user.findFirst({
    //       where: {
    //         email: credentials?.email
    //       }
    //     })

    //     if (user) {
    //       // Any object returned will be saved in `user` property of the JWT
    //       return user
    //     } else {
    //       // If you return null then an error will be displayed advising the user to check their details.
    //       return null
  
    //       // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
    //     }
    //   }
    // })
  ],
  // secret: process.env.NEXTAUTH_SECRET,
  // session: {
  //   strategy: "jwt"
  // }
};

export default NextAuth(authOptions);
