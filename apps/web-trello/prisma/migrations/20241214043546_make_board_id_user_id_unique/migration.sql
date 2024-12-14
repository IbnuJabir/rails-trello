/*
  Warnings:

  - A unique constraint covering the columns `[boardId,userId]` on the table `BoardMember` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BoardMember_boardId_userId_key" ON "BoardMember"("boardId", "userId");
