import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";

export const listRouter = router({
  getAll: protectedProcedure
    .input(z.object({ boardId: z.string() }))
    .query(async ({ input }) => {
      return prisma.list.findMany({
        where: { boardId: input.boardId },
        orderBy: { position: "asc" },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        boardId: z.string(),
        name: z.string(),
        position: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.list.create({
        data: input,
      });
    }),
  update: protectedProcedure
    .input(z.object({ id: z.string(), position: z.number() }))
    .mutation(async ({ input }) => {
      return prisma.list.update({
        where: { id: input.id },
        data: { position: input.position },
      });
    }),
  updateAll: protectedProcedure
    .input(
      z.record(
        z.string(),
        z.array(z.string()) // Key: listId, Value: array of cardIds
      )
    )
    .mutation(async ({ input }) => {
      const listUpdates: Prisma.PrismaPromise<any>[] = [];
      const cardUpdates: Prisma.PrismaPromise<any>[] = [];

      Object.entries(input).forEach(([listId, cardIds], listIndex) => {
        // Update the list's position
        listUpdates.push(
          prisma.list.update({
            where: { id: listId },
            data: { position: listIndex }, // Update list position
          })
        );

        // Update each card's listId and position
        cardIds.forEach((cardId, cardIndex) => {
          cardUpdates.push(
            prisma.card.update({
              where: { id: cardId },
              data: {
                listId, // Update the card's parent list
                position: cardIndex, // Update the card's position
              },
            })
          );
        });
      });

      // Execute all updates concurrently
      await Promise.all([...listUpdates, ...cardUpdates]);

      return { success: true };
    }),
  updateListPositions: protectedProcedure
    .input(
      z.array(z.string()) // An array of list IDs
    )
    .mutation(async ({ input }) => {
      // Iterate over the array and create update promises
      const updatePromises = input.map((id, index) =>
        prisma.list.update({
          where: { id },
          data: { position: index }, // Update the position based on the array index
        })
      );

      // Execute all updates concurrently
      await Promise.all(updatePromises);

      return { success: true };
    }),
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return prisma.list.delete({
        where: { id: input.id },
      });
    }),
});
