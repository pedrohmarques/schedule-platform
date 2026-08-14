/*
  Warnings:

  - Added the required column `area` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `JobRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `JobRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "area" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "JobRequest" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "price" DECIMAL(65,30) NOT NULL;
