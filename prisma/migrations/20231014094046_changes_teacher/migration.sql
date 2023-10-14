/*
  Warnings:

  - You are about to drop the column `email` on the `Teacher` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Teacher_email_key";

-- AlterTable
ALTER TABLE "Class" ALTER COLUMN "teacherId" DROP NOT NULL,
ALTER COLUMN "programId" DROP NOT NULL,
ALTER COLUMN "levelId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "teacherId" DROP NOT NULL,
ALTER COLUMN "programId" DROP NOT NULL,
ALTER COLUMN "levelId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "email",
ADD COLUMN     "username" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_username_key" ON "Teacher"("username");
