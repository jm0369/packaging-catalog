/*
  Warnings:

  - You are about to drop the column `formatsAndSpecifications` on the `Category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Category" DROP COLUMN "formatsAndSpecifications",
ADD COLUMN     "formatsSpecifications" JSONB;
