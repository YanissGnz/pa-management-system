/*
  Warnings:

  - You are about to drop the `_PaymentToStudent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PaymentToStudent" DROP CONSTRAINT "_PaymentToStudent_A_fkey";

-- DropForeignKey
ALTER TABLE "_PaymentToStudent" DROP CONSTRAINT "_PaymentToStudent_B_fkey";

-- DropTable
DROP TABLE "_PaymentToStudent";
