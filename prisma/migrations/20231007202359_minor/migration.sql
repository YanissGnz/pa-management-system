/*
  Warnings:

  - You are about to drop the column `end` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `start` on the `Session` table. All the data in the column will be lost.
  - Added the required column `endTime` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "end",
DROP COLUMN "start",
ADD COLUMN     "endTime" TEXT NOT NULL,
ADD COLUMN     "startTime" TEXT NOT NULL;
