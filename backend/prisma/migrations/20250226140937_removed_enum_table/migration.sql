/*
  Warnings:

  - You are about to drop the column `membershipType` on the `members` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "members" DROP COLUMN "membershipType";

-- DropEnum
DROP TYPE "MembershipType";
