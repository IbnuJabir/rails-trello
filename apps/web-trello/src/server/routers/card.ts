import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import prisma from "@/lib/db";

export const cardRouter = router({
  getAll: protectedProcedure
    .input(z.object({ boardId: z.string() }))
    .query(async ({ input }) => {
      return prisma.card.findMany({
        where: { list: { boardId: input.boardId } },
        orderBy: { position: "asc" },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        listId: z.string(),
        title: z.string(),
        position: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.card.create({
        data: input,
      });
    }),
  update: protectedProcedure
    .input(
      z.object({ id: z.string(), position: z.number(), listId: z.string() })
    )
    .mutation(async ({ input }) => {
      return prisma.card.update({
        where: { id: input.id },
        data: { position: input.position, listId: input.listId },
      });
    }),
  updatePosition: protectedProcedure
    .input(
      z.object({
        id: z.string(), // Card ID
        listId: z.string(), // The list ID the card belongs to
        position: z.number(), // The new position of the card
      })
    )
    .mutation(async ({ input }) => {
      const { id, listId, position } = input;

      return prisma.card.update({
        where: { id }, // Find the card by its ID
        data: {
          listId, // Update the list ID
          position, // Update the position within the list
        },
      });
    }),
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return prisma.card.delete({
        where: { id: input.id },
      });
    }),
});
