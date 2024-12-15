import NextAuth, { NextAuthResult } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { Adapter } from "next-auth/adapters";
import { encode as defaultEncode } from "next-auth/jwt";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/db";
import { getUserFromDb } from "@/server/actions/actions";
import { v4 as uuid } from "uuid";
import { User, type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      userId: string;
    } & DefaultSession["user"];
  }
}

const adapter = PrismaAdapter(prisma) as Adapter;
export const nextAuthResult = NextAuth({
  trustHost: true,
  theme: {
    logo: "/logo.jpg",
    brandColor: "#000000",
    colorScheme: "auto",
  },
  adapter,
  providers: [
    Google,
    GitHub,
    Credentials({
      // You can specify which fields should be submitted by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        if (!email || !password) {
          throw new Error("Email and password are required.");
        }

        const res = await getUserFromDb(email as string, password as string);

        if (res.success) {
          return res.data as User;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      return token;
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid();

        if (!params.token.sub) {
          throw new Error("No user ID found in token");
        }

        const createdSession = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        });

        if (!createdSession) {
          throw new Error("Failed to create session");
        }

        return sessionToken;
      }
      return defaultEncode(params);
    },
  },
});

export const auth: NextAuthResult["auth"] = nextAuthResult.auth;
export const signIn: NextAuthResult["signIn"] = nextAuthResult.signIn;
export const signOut: NextAuthResult["signOut"] = nextAuthResult.signOut;
// export const getSession: NextAuthResult["getSession"] = nextAuthResult.getSession;
export const { handlers }: NextAuthResult = nextAuthResult;
