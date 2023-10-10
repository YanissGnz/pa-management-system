/*
  Warnings:

  - You are about to drop the column `daysOfWeek` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `endRecur` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `startRecur` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Session` table. All the data in the column will be lost.
  - Added the required column `end` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "daysOfWeek",
DROP COLUMN "endRecur",
DROP COLUMN "endTime",
DROP COLUMN "startRecur",
DROP COLUMN "startTime",
ADD COLUMN     "end" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start" TIMESTAMP(3) NOT NULL;
