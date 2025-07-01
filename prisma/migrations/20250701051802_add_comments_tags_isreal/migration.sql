/*
  Warnings:

  - You are about to drop the column `isReal` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "isReal",
ADD COLUMN     "fakeVotes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "realVotes" INTEGER NOT NULL DEFAULT 0;
