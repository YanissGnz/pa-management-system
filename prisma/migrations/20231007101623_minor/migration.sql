/*
  Warnings:

  - You are about to drop the `classSessions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `day` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "classSessions" DROP CONSTRAINT "classSessions_classId_fkey";

-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "day" TEXT NOT NULL,
ADD COLUMN     "endTime" TEXT NOT NULL,
ADD COLUMN     "startTime" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "classId" TEXT;

-- DropTable
DROP TABLE "classSessions";

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;
