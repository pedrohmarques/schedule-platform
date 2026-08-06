/*
  Warnings:

  - You are about to drop the column `bairro` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `cep` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `cidade` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `complemento` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `numero` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `rua` on the `Address` table. All the data in the column will be lost.
  - Added the required column `city` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `neighborhood` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipCode` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Address_cep_idx";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "bairro",
DROP COLUMN "cep",
DROP COLUMN "cidade",
DROP COLUMN "complemento",
DROP COLUMN "estado",
DROP COLUMN "numero",
DROP COLUMN "rua",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "complement" TEXT,
ADD COLUMN     "neighborhood" TEXT NOT NULL,
ADD COLUMN     "number" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL,
ADD COLUMN     "zipCode" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Address_zipCode_idx" ON "Address"("zipCode");
