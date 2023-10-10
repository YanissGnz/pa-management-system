-- DropIndex
DROP INDEX "Session_color_key";

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "color" DROP DEFAULT;
