/*
  Warnings:

  - You are about to drop the column `expectedClasses` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "expectedClasses";

-- CreateTable
CREATE TABLE "ExpectedClass" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "dayId" TEXT NOT NULL,

    CONSTRAINT "ExpectedClass_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExpectedClass" ADD CONSTRAINT "ExpectedClass_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
