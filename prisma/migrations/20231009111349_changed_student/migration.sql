/*
  Warnings:

  - You are about to drop the column `birthDate` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Student` table. All the data in the column will be lost.
  - Added the required column `fullName` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "attendance" SET DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "birthDate",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "age" INTEGER,
ADD COLUMN     "fullName" TEXT NOT NULL;
