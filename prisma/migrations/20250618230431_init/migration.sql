/*
  Warnings:

  - Changed the type of `status` on the `Receipt` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ReceiptStatus" AS ENUM ('pending', 'validated', 'rejected', 'observed');

-- AlterTable
ALTER TABLE "Receipt" DROP COLUMN "status",
ADD COLUMN     "status" "ReceiptStatus" NOT NULL;
