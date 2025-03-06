/*
  Warnings:

  - The values [BASIC,PREMIUM,VIP] on the enum `MembershipType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MembershipType_new" AS ENUM ('MONTHLY', 'DAILY');
ALTER TABLE "members" ALTER COLUMN "membershipType" TYPE "MembershipType_new" USING ("membershipType"::text::"MembershipType_new");
ALTER TYPE "MembershipType" RENAME TO "MembershipType_old";
ALTER TYPE "MembershipType_new" RENAME TO "MembershipType";
DROP TYPE "MembershipType_old";
COMMIT;
