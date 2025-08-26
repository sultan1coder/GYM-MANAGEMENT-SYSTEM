-- Complete Payment System Migration
-- Add all missing payment features for production-ready system

-- 1. Add recurring payments table
CREATE TABLE "public"."RecurringPayment" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "frequency" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "nextPaymentDate" TIMESTAMP(3) NOT NULL,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "retryDelay" INTEGER NOT NULL DEFAULT 3,
    "autoRetry" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "lastProcessedDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecurringPayment_pkey" PRIMARY KEY ("id")
);

-- 2. Add installment plans table
CREATE TABLE "public"."InstallmentPlan" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "numberOfInstallments" INTEGER NOT NULL,
    "installmentAmount" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "dueDayOfMonth" INTEGER,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "currentInstallment" INTEGER NOT NULL DEFAULT 1,
    "nextDueDate" TIMESTAMP(3),
    "lastProcessedDate" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InstallmentPlan_pkey" PRIMARY KEY ("id")
);

-- 3. Add payment audit logs table
CREATE TABLE "public"."PaymentAuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "userId" INTEGER,
    "memberId" TEXT,
    "paymentId" TEXT,
    "details" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentAuditLog_pkey" PRIMARY KEY ("id")
);

-- 4. Add payment compliance checks table
CREATE TABLE "public"."PaymentComplianceCheck" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "checkType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentComplianceCheck_pkey" PRIMARY KEY ("id")
);

-- 5. Add payment methods table
CREATE TABLE "public"."PaymentMethod" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "last4" TEXT NOT NULL,
    "brand" TEXT,
    "expiryMonth" INTEGER,
    "expiryYear" INTEGER,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "encryptedData" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- 6. Add payment schedules table
CREATE TABLE "public"."PaymentSchedule" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "lateFees" DOUBLE PRECISION DEFAULT 0,
    "reminderSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentSchedule_pkey" PRIMARY KEY ("id")
);

-- 7. Add payment refunds table
CREATE TABLE "public"."PaymentRefund" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "reason" TEXT NOT NULL,
    "processedBy" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentRefund_pkey" PRIMARY KEY ("id")
);

-- 8. Add payment webhooks table
CREATE TABLE "public"."PaymentWebhook" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "webhookType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastAttempt" TIMESTAMP(3),
    "nextAttempt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentWebhook_pkey" PRIMARY KEY ("id")
);

-- 9. Add foreign key constraints
ALTER TABLE "public"."RecurringPayment" ADD CONSTRAINT "RecurringPayment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."InstallmentPlan" ADD CONSTRAINT "InstallmentPlan_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."PaymentAuditLog" ADD CONSTRAINT "PaymentAuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."PaymentAuditLog" ADD CONSTRAINT "PaymentAuditLog_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."PaymentAuditLog" ADD CONSTRAINT "PaymentAuditLog_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "public"."Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."PaymentComplianceCheck" ADD CONSTRAINT "PaymentComplianceCheck_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "public"."Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."PaymentMethod" ADD CONSTRAINT "PaymentMethod_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."PaymentSchedule" ADD CONSTRAINT "PaymentSchedule_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."PaymentRefund" ADD CONSTRAINT "PaymentRefund_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "public"."Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."PaymentWebhook" ADD CONSTRAINT "PaymentWebhook_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "public"."Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 10. Add indexes for performance
CREATE INDEX "RecurringPayment_memberId_idx" ON "public"."RecurringPayment"("memberId");
CREATE INDEX "RecurringPayment_status_idx" ON "public"."RecurringPayment"("status");
CREATE INDEX "RecurringPayment_nextPaymentDate_idx" ON "public"."RecurringPayment"("nextPaymentDate");
CREATE INDEX "InstallmentPlan_memberId_idx" ON "public"."InstallmentPlan"("memberId");
CREATE INDEX "InstallmentPlan_status_idx" ON "public"."InstallmentPlan"("status");
CREATE INDEX "InstallmentPlan_nextDueDate_idx" ON "public"."InstallmentPlan"("nextDueDate");
CREATE INDEX "PaymentAuditLog_timestamp_idx" ON "public"."PaymentAuditLog"("timestamp");
CREATE INDEX "PaymentAuditLog_action_idx" ON "public"."PaymentAuditLog"("action");
CREATE INDEX "PaymentAuditLog_userId_idx" ON "public"."PaymentAuditLog"("userId");
CREATE INDEX "PaymentAuditLog_memberId_idx" ON "public"."PaymentAuditLog"("memberId");
CREATE INDEX "PaymentAuditLog_paymentId_idx" ON "public"."PaymentAuditLog"("paymentId");
CREATE INDEX "PaymentComplianceCheck_paymentId_idx" ON "public"."PaymentComplianceCheck"("paymentId");
CREATE INDEX "PaymentComplianceCheck_checkType_idx" ON "public"."PaymentComplianceCheck"("checkType");
CREATE INDEX "PaymentComplianceCheck_status_idx" ON "public"."PaymentComplianceCheck"("status");
CREATE INDEX "PaymentMethod_memberId_idx" ON "public"."PaymentMethod"("memberId");
CREATE INDEX "PaymentMethod_status_idx" ON "public"."PaymentMethod"("status");
CREATE INDEX "PaymentSchedule_memberId_idx" ON "public"."PaymentSchedule"("memberId");
CREATE INDEX "PaymentSchedule_dueDate_idx" ON "public"."PaymentSchedule"("dueDate");
CREATE INDEX "PaymentSchedule_status_idx" ON "public"."PaymentSchedule"("status");
CREATE INDEX "PaymentRefund_paymentId_idx" ON "public"."PaymentRefund"("paymentId");
CREATE INDEX "PaymentRefund_status_idx" ON "public"."PaymentRefund"("status");
CREATE INDEX "PaymentWebhook_paymentId_idx" ON "public"."PaymentWebhook"("paymentId");
CREATE INDEX "PaymentWebhook_status_idx" ON "public"."PaymentWebhook"("status");

-- 11. Add constraints for data integrity
ALTER TABLE "public"."RecurringPayment" ADD CONSTRAINT "RecurringPayment_frequency_check" CHECK ("frequency" IN ('daily', 'weekly', 'monthly', 'yearly'));
ALTER TABLE "public"."RecurringPayment" ADD CONSTRAINT "RecurringPayment_status_check" CHECK ("status" IN ('ACTIVE', 'PAUSED', 'CANCELLED', 'FAILED', 'COMPLETED'));
ALTER TABLE "public"."InstallmentPlan" ADD CONSTRAINT "InstallmentPlan_status_check" CHECK ("status" IN ('ACTIVE', 'OVERDUE', 'COMPLETED', 'CANCELLED'));
ALTER TABLE "public"."PaymentComplianceCheck" ADD CONSTRAINT "PaymentComplianceCheck_checkType_check" CHECK ("checkType" IN ('PCI', 'GDPR', 'AML', 'KYC'));
ALTER TABLE "public"."PaymentComplianceCheck" ADD CONSTRAINT "PaymentComplianceCheck_status_check" CHECK ("status" IN ('PASSED', 'FAILED', 'PENDING'));
ALTER TABLE "public"."PaymentMethod" ADD CONSTRAINT "PaymentMethod_type_check" CHECK ("type" IN ('credit_card', 'debit_card', 'bank_account', 'digital_wallet'));
ALTER TABLE "public"."PaymentMethod" ADD CONSTRAINT "PaymentMethod_status_check" CHECK ("status" IN ('ACTIVE', 'INACTIVE', 'EXPIRED', 'BLOCKED'));
ALTER TABLE "public"."PaymentSchedule" ADD CONSTRAINT "PaymentSchedule_status_check" CHECK ("status" IN ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED'));
ALTER TABLE "public"."PaymentRefund" ADD CONSTRAINT "PaymentRefund_status_check" CHECK ("status" IN ('PENDING', 'PROCESSED', 'FAILED', 'CANCELLED'));
ALTER TABLE "public"."PaymentWebhook" ADD CONSTRAINT "PaymentWebhook_status_check" CHECK ("status" IN ('PENDING', 'PROCESSED', 'FAILED', 'RETRY'));

-- 12. Update existing Payment table with additional fields
ALTER TABLE "public"."Payment" ADD COLUMN IF NOT EXISTS "lateFees" DOUBLE PRECISION DEFAULT 0;
ALTER TABLE "public"."Payment" ADD COLUMN IF NOT EXISTS "taxAmount" DOUBLE PRECISION DEFAULT 0;
ALTER TABLE "public"."Payment" ADD COLUMN IF NOT EXISTS "processingFee" DOUBLE PRECISION DEFAULT 0;
ALTER TABLE "public"."Payment" ADD COLUMN IF NOT EXISTS "currency" TEXT DEFAULT 'USD';
ALTER TABLE "public"."Payment" ADD COLUMN IF NOT EXISTS "gatewayTransactionId" TEXT;
ALTER TABLE "public"."Payment" ADD COLUMN IF NOT EXISTS "gatewayResponse" JSONB;
ALTER TABLE "public"."Payment" ADD COLUMN IF NOT EXISTS "retryCount" INTEGER DEFAULT 0;
ALTER TABLE "public"."Payment" ADD COLUMN IF NOT EXISTS "nextRetryDate" TIMESTAMP(3);

-- 13. Add indexes to existing Payment table
CREATE INDEX IF NOT EXISTS "Payment_gatewayTransactionId_idx" ON "public"."Payment"("gatewayTransactionId");
CREATE INDEX IF NOT EXISTS "Payment_currency_idx" ON "public"."Payment"("currency");
CREATE INDEX IF NOT EXISTS "Payment_createdAt_idx" ON "public"."Payment"("createdAt");

-- 14. Create views for common queries
CREATE OR REPLACE VIEW "public"."PaymentSummary" AS
SELECT 
    "memberId",
    COUNT(*) as "totalPayments",
    SUM(CASE WHEN "status" = 'COMPLETED' THEN "amount" ELSE 0 END) as "totalPaid",
    SUM(CASE WHEN "status" = 'PENDING' THEN "amount" ELSE 0 END) as "pendingAmount",
    SUM(CASE WHEN "status" = 'FAILED' THEN "amount" ELSE 0 END) as "failedAmount",
    MAX("createdAt") as "lastPaymentDate"
FROM "public"."Payment"
GROUP BY "memberId";

CREATE OR REPLACE VIEW "public"."OverduePayments" AS
SELECT 
    p.*,
    m."name" as "memberName",
    m."email" as "memberEmail",
    EXTRACT(DAY FROM (NOW() - p."createdAt")) as "daysOverdue"
FROM "public"."Payment" p
JOIN "public"."Member" m ON p."memberId" = m."id"
WHERE p."status" = 'PENDING' 
AND p."createdAt" < NOW() - INTERVAL '7 days';