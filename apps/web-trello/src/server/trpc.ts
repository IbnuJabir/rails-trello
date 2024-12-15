import { initTRPC, TRPCError } from "@trpc/server";
import { ZodError } from "zod";
import { Context } from "./context";

// Initialize tRPC with custom error formatting
const t = initTRPC.context<Context>().create({
  errorFormatter(opts) {
    const { shape, error } = opts;
    console.log("error.code", error.code);
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
});

// Base router and procedure helpers
export const router = t.router;
// export const procedure = t.procedure;

/**
 * Unprotected procedure
 */
export const publicProcedure = t.procedure;

/**
 * Protected procedure
 */
export const protectedProcedure = t.procedure.use(function isAuthed({
  ctx,
  next,
}) {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      // Infers that `session` is non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});
