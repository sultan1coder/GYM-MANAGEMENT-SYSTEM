/*
  Warnings:

  - You are about to drop the column `phone_number` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Member" ALTER COLUMN "age" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "phone_number";
