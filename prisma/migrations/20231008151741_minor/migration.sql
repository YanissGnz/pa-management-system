/*
  Warnings:

  - A unique constraint covering the columns `[classId]` on the table `Session` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "classId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Session_classId_key" ON "Session"("classId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;
