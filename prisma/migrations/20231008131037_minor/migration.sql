/*
  Warnings:

  - A unique constraint covering the columns `[title,start,end]` on the table `Session` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Session_title_key";

-- CreateIndex
CREATE UNIQUE INDEX "Session_title_start_end_key" ON "Session"("title", "start", "end");
