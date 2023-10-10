-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_sessionId_fkey";

-- CreateTable
CREATE TABLE "_SessionToStudent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SessionToStudent_AB_unique" ON "_SessionToStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_SessionToStudent_B_index" ON "_SessionToStudent"("B");

-- AddForeignKey
ALTER TABLE "_SessionToStudent" ADD CONSTRAINT "_SessionToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SessionToStudent" ADD CONSTRAINT "_SessionToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
