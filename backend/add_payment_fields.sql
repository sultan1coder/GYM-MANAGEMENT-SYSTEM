-- Add Enhanced Payment Fields
-- This script adds the missing enhanced fields to the Payment table

-- Add enhanced payment fields
ALTER TABLE "public"."Payment" ADD COLUMN IF NOT EXISTS "lateFees" DOUBLE PRECISION DEFAULT 0;
ALTER TABLE "public"."Payment" ADD COLUMN IF NOT EXISTS "taxAmount" DOUBLE PRECISION DEFAULT 0;
ALTER TABLE "public"."Payment" ADD COLUMN IF NOT EXISTS "processingFee" DOUBLE PRECISION DEFAULT 0;
ALTER TABLE "public"."Payment" ADD COLUMN IF NOT EXISTS "currency" TEXT DEFAULT 'USD';
ALTER TABLE "public"."Payment" ADD COLUMN IF NOT EXISTS "gatewayTransactionId" TEXT;
ALTER TABLE "public"."Payment" ADD COLUMN IF NOT EXISTS "gatewayResponse" JSONB;
ALTER TABLE "public"."Payment" ADD COLUMN IF NOT EXISTS "retryCount" INTEGER DEFAULT 0;
ALTER TABLE "public"."Payment" ADD COLUMN IF NOT EXISTS "nextRetryDate" TIMESTAMP(3);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS "Payment_gatewayTransactionId_idx" ON "public"."Payment"("gatewayTransactionId");
CREATE INDEX IF NOT EXISTS "Payment_currency_idx" ON "public"."Payment"("currency");
CREATE INDEX IF NOT EXISTS "Payment_createdAt_idx" ON "public"."Payment"("createdAt");

-- Verify the fields were added
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'Payment' 
AND table_schema = 'public'
ORDER BY ordinal_position;
