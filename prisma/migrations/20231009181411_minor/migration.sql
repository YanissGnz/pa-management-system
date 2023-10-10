/*
  Warnings:

  - A unique constraint covering the columns `[fullName]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Student_fullName_key" ON "Student"("fullName");
