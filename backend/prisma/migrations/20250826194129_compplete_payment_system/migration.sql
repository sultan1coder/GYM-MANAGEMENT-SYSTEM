/*
  Warnings:

  - You are about to drop the column `currency` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `gatewayResponse` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `gatewayTransactionId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `lateFees` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `nextRetryDate` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `processingFee` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `retryCount` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `taxAmount` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the `InstallmentPlan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaymentAuditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaymentComplianceCheck` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaymentMethod` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaymentRefund` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaymentSchedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaymentWebhook` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RecurringPayment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."InstallmentPlan" DROP CONSTRAINT "InstallmentPlan_memberId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PaymentAuditLog" DROP CONSTRAINT "PaymentAuditLog_memberId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PaymentAuditLog" DROP CONSTRAINT "PaymentAuditLog_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PaymentAuditLog" DROP CONSTRAINT "PaymentAuditLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PaymentComplianceCheck" DROP CONSTRAINT "PaymentComplianceCheck_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PaymentMethod" DROP CONSTRAINT "PaymentMethod_memberId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PaymentRefund" DROP CONSTRAINT "PaymentRefund_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PaymentSchedule" DROP CONSTRAINT "PaymentSchedule_memberId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PaymentWebhook" DROP CONSTRAINT "PaymentWebhook_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RecurringPayment" DROP CONSTRAINT "RecurringPayment_memberId_fkey";

-- DropIndex
DROP INDEX "public"."Payment_createdAt_idx";

-- DropIndex
DROP INDEX "public"."Payment_currency_idx";

-- DropIndex
DROP INDEX "public"."Payment_gatewayTransactionId_idx";

-- AlterTable
ALTER TABLE "public"."Payment" DROP COLUMN "currency",
DROP COLUMN "gatewayResponse",
DROP COLUMN "gatewayTransactionId",
DROP COLUMN "lateFees",
DROP COLUMN "nextRetryDate",
DROP COLUMN "processingFee",
DROP COLUMN "retryCount",
DROP COLUMN "taxAmount";

-- DropTable
DROP TABLE "public"."InstallmentPlan";

-- DropTable
DROP TABLE "public"."PaymentAuditLog";

-- DropTable
DROP TABLE "public"."PaymentComplianceCheck";

-- DropTable
DROP TABLE "public"."PaymentMethod";

-- DropTable
DROP TABLE "public"."PaymentRefund";

-- DropTable
DROP TABLE "public"."PaymentSchedule";

-- DropTable
DROP TABLE "public"."PaymentWebhook";

-- DropTable
DROP TABLE "public"."RecurringPayment";
