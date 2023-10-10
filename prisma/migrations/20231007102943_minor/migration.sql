/*
  Warnings:

  - You are about to drop the `ExpectedClass` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExpectedClass" DROP CONSTRAINT "ExpectedClass_studentId_fkey";

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "expectedClasses" TEXT[];

-- DropTable
DROP TABLE "ExpectedClass";
