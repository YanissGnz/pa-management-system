/*
  Warnings:

  - You are about to drop the column `day` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Class` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Class" DROP COLUMN "day",
DROP COLUMN "endTime",
DROP COLUMN "startTime";
