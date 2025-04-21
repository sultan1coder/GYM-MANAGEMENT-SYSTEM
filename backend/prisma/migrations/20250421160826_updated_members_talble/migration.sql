/*
  Warnings:

  - Added the required column `confirmPassword` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "confirmPassword" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phone_number" TEXT;
