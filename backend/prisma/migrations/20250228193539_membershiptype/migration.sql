/*
  Warnings:

  - Added the required column `membershiptype` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MemberShipType" AS ENUM ('MONTHLY', 'DAILY');

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "membershiptype" "MemberShipType" NOT NULL;
