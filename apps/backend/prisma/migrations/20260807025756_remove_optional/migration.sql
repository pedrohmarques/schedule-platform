/*
  Warnings:

  - Made the column `city` on table `Client` required. This step will fail if there are existing NULL values in that column.
  - Made the column `neighborhood` on table `Client` required. This step will fail if there are existing NULL values in that column.
  - Made the column `number` on table `Client` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state` on table `Client` required. This step will fail if there are existing NULL values in that column.
  - Made the column `street` on table `Client` required. This step will fail if there are existing NULL values in that column.
  - Made the column `zipCode` on table `Client` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `Profissional` required. This step will fail if there are existing NULL values in that column.
  - Made the column `neighborhood` on table `Profissional` required. This step will fail if there are existing NULL values in that column.
  - Made the column `number` on table `Profissional` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state` on table `Profissional` required. This step will fail if there are existing NULL values in that column.
  - Made the column `street` on table `Profissional` required. This step will fail if there are existing NULL values in that column.
  - Made the column `zipCode` on table `Profissional` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "neighborhood" SET NOT NULL,
ALTER COLUMN "number" SET NOT NULL,
ALTER COLUMN "state" SET NOT NULL,
ALTER COLUMN "street" SET NOT NULL,
ALTER COLUMN "zipCode" SET NOT NULL;

-- AlterTable
ALTER TABLE "Profissional" ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "neighborhood" SET NOT NULL,
ALTER COLUMN "number" SET NOT NULL,
ALTER COLUMN "state" SET NOT NULL,
ALTER COLUMN "street" SET NOT NULL,
ALTER COLUMN "zipCode" SET NOT NULL;
