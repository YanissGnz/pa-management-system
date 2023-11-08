-- DropForeignKey
ALTER TABLE "Level" DROP CONSTRAINT "Level_programId_fkey";

-- AddForeignKey
ALTER TABLE "Level" ADD CONSTRAINT "Level_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;
