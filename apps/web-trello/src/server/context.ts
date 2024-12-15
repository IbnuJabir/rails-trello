import { auth } from "@/auth";
// import getSession from "@/lib/getSession";
/**
 * Creates context for an incoming request
 *
 */
export async function createContext(opts: { req: Request; res: Response }) {
  const session = await auth();

  return {
    ...opts,
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
