-- DropForeignKey
ALTER TABLE "Kid" DROP CONSTRAINT "Kid_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Partner" DROP CONSTRAINT "Partner_partnerId_fkey";

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kid" ADD CONSTRAINT "Kid_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
