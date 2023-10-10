/*
  Warnings:

  - You are about to drop the `PaymentOnStudent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PaymentOnStudent" DROP CONSTRAINT "PaymentOnStudent_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "PaymentOnStudent" DROP CONSTRAINT "PaymentOnStudent_studentId_fkey";

-- DropTable
DROP TABLE "PaymentOnStudent";
