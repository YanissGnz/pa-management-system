-- DropForeignKey
ALTER TABLE "classSessions" DROP CONSTRAINT "classSessions_classId_fkey";

-- AddForeignKey
ALTER TABLE "classSessions" ADD CONSTRAINT "classSessions_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;
