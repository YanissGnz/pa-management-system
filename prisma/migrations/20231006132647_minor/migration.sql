-- DropForeignKey
ALTER TABLE "Partner" DROP CONSTRAINT "Partner_studentId_fkey";

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
