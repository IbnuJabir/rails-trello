import { protectedProcedure, router } from "../trpc";
import prisma from "@/lib/db";
import { signInSchema, signUpSchema } from "@/lib/schema";
import bcryptjs from "bcryptjs";
import { TRPCError } from "@trpc/server";
import { signIn } from "@/auth";
import { revalidatePath } from "next/cache";

export const userRouter = router({
  getUsers: protectedProcedure.query(async () => {
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });
  }),
  addUser: protectedProcedure
    .input(signUpSchema)
    .mutation(async ({ input, ctx }) => {
      const { name, email, password } = input;
      console.log(ctx.session);

      // Check for existing user and hash password concurrently
      const [existingUser, hashedPassword] = await Promise.all([
        prisma.user.findUnique({ where: { email } }),
        bcryptjs.hash(password, parseInt(process.env.SALT_ROUNDS || "10", 10)),
      ]);

      // If user exists, throw an error
      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists with that email",
        });
      }

      try {
        // Create the new user
        await prisma.user.create({
          data: { name, email, password: hashedPassword },
        });

        // Sign in the user
        const user = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        revalidatePath("/");

        return {
          success: true,
          data: user,
        };
      } catch (error) {
        console.error("Error during user registration:", error);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong. Please try again.",
        });
      }
    }),
  loginUser: protectedProcedure
    .input(signInSchema)
    .mutation(async ({ input }) => {
      const { email, password } = input;
      try {
        const user = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        revalidatePath("/");

        return {
          success: true,
          data: user,
        };
      } catch (error) {
        console.error("Error during user login:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong. Please try again.",
        });
      }
    }),
});
