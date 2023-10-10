/*
  Warnings:

  - You are about to drop the column `name` on the `Class` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `Class` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[color]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Class" DROP COLUMN "name",
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "color" SET DEFAULT 'blue';

-- CreateIndex
CREATE UNIQUE INDEX "Class_title_key" ON "Class"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Session_title_key" ON "Session"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Session_color_key" ON "Session"("color");
