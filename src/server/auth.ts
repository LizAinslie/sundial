import type { GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./db";
import * as bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

/**
 * Module augmentation for `next-auth` types.
 * Allows us to add custom properties to the `session` object and keep type
 * safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: Partial<User>;
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks,
 * etc.
 *
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, token }) {
      if (token.user) {
        const tokenUser = token.user as User;
        session.user = {
          username: tokenUser.username,
          id: tokenUser.id,
          admin: tokenUser.admin,
        };
      }
      // console.log(session)

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        const prismaUser = await prisma.user.findUnique({
          where: { id: user.id },
        });
        // console.log('jwt user', prismaUser);
        token.user = user;
      }
      return token;
    },
  },
  session: { strategy: "jwt" },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Username" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials, _) {
        if (!credentials) return null;

        // Add logic here to look up the user from the credentials supplied
        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });

        console.log(user);

        if (!user) return null;

        // check pw
        if (bcrypt.compareSync(credentials.password, user.passwordHash))
          return user;
        else return null;
      },
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the
 * `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 **/
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
