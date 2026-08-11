/*
  Warnings:

  - You are about to drop the column `addressId` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `addressId` on the `Profissional` table. All the data in the column will be lost.
  - You are about to drop the `Address` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_addressId_fkey";

-- DropForeignKey
ALTER TABLE "Profissional" DROP CONSTRAINT "Profissional_addressId_fkey";

-- DropIndex
DROP INDEX "Client_addressId_key";

-- DropIndex
DROP INDEX "Profissional_addressId_key";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "addressId",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "complement" TEXT,
ADD COLUMN     "neighborhood" TEXT,
ADD COLUMN     "number" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "street" TEXT,
ADD COLUMN     "zipCode" TEXT;

-- AlterTable
ALTER TABLE "Profissional" DROP COLUMN "addressId",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "complement" TEXT,
ADD COLUMN     "neighborhood" TEXT,
ADD COLUMN     "number" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "street" TEXT,
ADD COLUMN     "zipCode" TEXT;

-- DropTable
DROP TABLE "Address";

-- CreateIndex
CREATE INDEX "Client_zipCode_idx" ON "Client"("zipCode");

-- CreateIndex
CREATE INDEX "Profissional_zipCode_idx" ON "Profissional"("zipCode");
