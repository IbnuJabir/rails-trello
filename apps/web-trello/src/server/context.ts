import getSession from "@/lib/getSession";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
// import { getSession } from "next-auth/react";

/**
 * Creates context for an incoming request
 *
 */
export async function createContext(opts: CreateNextContextOptions) {
  const session = await getSession();

  return {
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
