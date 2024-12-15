import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import prisma from "@/lib/db";
import { TRPCError } from "@trpc/server";

export const boardRouter = router({
  // Get all boards for the logged-in user (owned or member)
  getBoards: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user?.id;
    console.log("from boards");
    console.log(ctx);
    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    return await prisma.board.findMany({
      where: {
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
      },
      include: {
        members: true,
      },
    });
  }),

  // Get a single board by ID
  getBoard: protectedProcedure
    .input(z.object({ boardId: z.string() }))
    .query(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id;
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      return await prisma.board.findUnique({
        where: { id: input.boardId },
        include: {
          members: true,
        },
      });
    }),

  // Create a new board
  createBoard: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Board name is required"),
        isPrivate: z.boolean().optional().default(true),
        bgImage: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id;
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      return await prisma.board.create({
        data: {
          name: input.name,
          isPrivate: input.isPrivate,
          ownerId: userId,
          bgImage: input.bgImage,
        },
      });
    }),

  // Add a member to a board
  addMember: protectedProcedure
    .input(
      z.object({
        boardId: z.string(),
        userId: z.string(),
        role: z.enum(["OWNER", "EDITOR", "VIEWER"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const requestingUserId = ctx.session?.user?.id;
      if (!requestingUserId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const board = await prisma.board.findUnique({
        where: { id: input.boardId },
      });
      if (!board || board.ownerId !== requestingUserId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only the board owner can add members",
        });
      }

      return await prisma.boardMember.create({
        data: {
          boardId: input.boardId,
          userId: input.userId,
          role: input.role,
        },
      });
    }),

  // Remove a member from a board
  removeMember: protectedProcedure
    .input(
      z.object({
        boardId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const requestingUserId = ctx.session?.user?.id;
      if (!requestingUserId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const board = await prisma.board.findUnique({
        where: { id: input.boardId },
      });
      if (!board || board.ownerId !== requestingUserId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only the board owner can remove members",
        });
      }

      return await prisma.boardMember.delete({
        where: {
          boardId_userId: {
            boardId: input.boardId,
            userId: input.userId,
          },
        },
      });
    }),

  // Update board details (e.g., name, privacy, background image)
  updateBoard: protectedProcedure
    .input(
      z.object({
        boardId: z.string(),
        name: z.string().optional(),
        isPrivate: z.boolean().optional(),
        bgImage: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const requestingUserId = ctx.session?.user?.id;
      if (!requestingUserId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const board = await prisma.board.findUnique({
        where: { id: input.boardId },
      });
      if (!board || board.ownerId !== requestingUserId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only the board owner can update the board",
        });
      }

      return await prisma.board.update({
        where: { id: input.boardId },
        data: {
          name: input.name,
          isPrivate: input.isPrivate,
          bgImage: input.bgImage,
        },
      });
    }),

  // Delete a board
  deleteBoard: protectedProcedure
    .input(z.object({ boardId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const requestingUserId = ctx.session?.user?.id;
      if (!requestingUserId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const board = await prisma.board.findUnique({
        where: { id: input.boardId },
      });
      if (!board || board.ownerId !== requestingUserId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only the board owner can delete the board",
        });
      }

      return await prisma.board.delete({
        where: { id: input.boardId },
      });
    }),
});
