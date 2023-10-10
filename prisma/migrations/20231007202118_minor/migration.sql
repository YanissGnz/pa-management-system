/*
  Warnings:

  - Added the required column `endRecur` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `levelId` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `programId` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startRecur` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherId` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "endRecur" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "levelId" TEXT NOT NULL,
ADD COLUMN     "programId" TEXT NOT NULL,
ADD COLUMN     "startRecur" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "teacherId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
