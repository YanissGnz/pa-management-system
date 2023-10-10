-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_paymentId_fkey";

-- CreateTable
CREATE TABLE "_PaymentToStudent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PaymentToStudent_AB_unique" ON "_PaymentToStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_PaymentToStudent_B_index" ON "_PaymentToStudent"("B");

-- AddForeignKey
ALTER TABLE "_PaymentToStudent" ADD CONSTRAINT "_PaymentToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PaymentToStudent" ADD CONSTRAINT "_PaymentToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
