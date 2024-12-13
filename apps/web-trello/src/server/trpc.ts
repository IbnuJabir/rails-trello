import { initTRPC } from "@trpc/server";
import { ZodError } from "zod";

// Initialize tRPC with custom error formatting
const t = initTRPC.create({
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
export const procedure = t.procedure;
