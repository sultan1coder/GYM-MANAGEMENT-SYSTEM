-- Enhance Payment Schema
-- Add missing fields for comprehensive payment management

-- Add status field with default value
ALTER TABLE "public"."Payment" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'PENDING';

-- Add description field
ALTER TABLE "public"."Payment" ADD COLUMN "description" TEXT;

-- Add reference field
ALTER TABLE "public"."Payment" ADD COLUMN "reference" TEXT;

-- Add updatedAt field
ALTER TABLE "public"."Payment" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Create PaymentStatus enum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED');

-- Update existing payments to have COMPLETED status (assuming they were successful)
UPDATE "public"."Payment" SET "status" = 'COMPLETED' WHERE "status" IS NULL OR "status" = 'PENDING';

-- Add constraint to ensure status is one of the enum values
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_status_check" CHECK ("status" IN ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED'));

-- Create index on status for better query performance
CREATE INDEX "Payment_status_idx" ON "public"."Payment"("status");

-- Create index on memberId and status for member payment queries
CREATE INDEX "Payment_memberId_status_idx" ON "public"."Payment"("memberId", "status");
