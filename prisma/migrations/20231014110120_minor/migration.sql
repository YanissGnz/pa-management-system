/*
  Warnings:

  - You are about to drop the column `period` on the `Payment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `Program` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `from` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Program` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "period",
ADD COLUMN     "from" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "to" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "discount" DROP NOT NULL,
ALTER COLUMN "payedAmount" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Program_code_key" ON "Program"("code");
