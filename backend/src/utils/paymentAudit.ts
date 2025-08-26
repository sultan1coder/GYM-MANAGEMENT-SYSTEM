import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface AuditLogEntry {
  action: string;
  userId?: string;
  memberId?: string;
  paymentId?: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export interface ComplianceCheck {
  paymentId: string;
  checkType: "PCI" | "GDPR" | "AML" | "KYC";
  status: "PASSED" | "FAILED" | "PENDING";
  details: string;
  timestamp: Date;
}

// Log payment activity for audit purposes
export const logPaymentActivity = async (entry: AuditLogEntry) => {
  try {
    await prisma.paymentAuditLog.create({
      data: {
        action: entry.action,
        userId: entry.userId,
        memberId: entry.memberId,
        paymentId: entry.paymentId,
        details: entry.details,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
        metadata: entry.metadata,
        timestamp: new Date(),
      },
    });

    console.log(`Payment audit log created: ${entry.action}`);
  } catch (error) {
    console.error("Failed to create payment audit log:", error);
    // Don't throw error as audit logging shouldn't break main functionality
  }
};

// Log payment creation
export const logPaymentCreation = async (
  payment: any,
  userId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  await logPaymentActivity({
    action: "PAYMENT_CREATED",
    userId,
    memberId: payment.memberId,
    paymentId: payment.id,
    details: `Payment of $${payment.amount} created for member ${payment.memberId}`,
    ipAddress,
    userAgent,
    metadata: {
      amount: payment.amount,
      method: payment.method,
      status: payment.status,
    },
  });
};

// Log payment update
export const logPaymentUpdate = async (
  paymentId: string,
  userId: string,
  changes: Record<string, any>,
  ipAddress?: string,
  userAgent?: string
) => {
  await logPaymentActivity({
    action: "PAYMENT_UPDATED",
    userId,
    paymentId,
    details: `Payment ${paymentId} updated with changes: ${JSON.stringify(
      changes
    )}`,
    ipAddress,
    userAgent,
    metadata: { changes },
  });
};

// Log payment deletion
export const logPaymentDeletion = async (
  paymentId: string,
  userId: string,
  reason: string,
  ipAddress?: string,
  userAgent?: string
) => {
  await logPaymentActivity({
    action: "PAYMENT_DELETED",
    userId,
    paymentId,
    details: `Payment ${paymentId} deleted. Reason: ${reason}`,
    ipAddress,
    userAgent,
    metadata: { reason },
  });
};

// Log payment status change
export const logPaymentStatusChange = async (
  paymentId: string,
  userId: string,
  oldStatus: string,
  newStatus: string,
  reason?: string,
  ipAddress?: string,
  userAgent?: string
) => {
  await logPaymentActivity({
    action: "PAYMENT_STATUS_CHANGED",
    userId,
    paymentId,
    details: `Payment ${paymentId} status changed from ${oldStatus} to ${newStatus}${
      reason ? `. Reason: ${reason}` : ""
    }`,
    ipAddress,
    userAgent,
    metadata: {
      oldStatus,
      newStatus,
      reason,
    },
  });
};

// Log payment access
export const logPaymentAccess = async (
  paymentId: string,
  userId: string,
  accessType: "VIEW" | "EXPORT" | "REPORT",
  ipAddress?: string,
  userAgent?: string
) => {
  await logPaymentActivity({
    action: `PAYMENT_${accessType}`,
    userId,
    paymentId,
    details: `Payment ${paymentId} accessed for ${accessType.toLowerCase()}`,
    ipAddress,
    userAgent,
    metadata: { accessType },
  });
};

// Log failed payment attempt
export const logFailedPaymentAttempt = async (
  memberId: string,
  amount: number,
  method: string,
  error: string,
  ipAddress?: string,
  userAgent?: string
) => {
  await logPaymentActivity({
    action: "PAYMENT_ATTEMPT_FAILED",
    memberId,
    details: `Failed payment attempt: $${amount} via ${method}. Error: ${error}`,
    ipAddress,
    userAgent,
    metadata: {
      amount,
      method,
      error,
    },
  });
};

// Log successful payment
export const logSuccessfulPayment = async (
  payment: any,
  userId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  await logPaymentActivity({
    action: "PAYMENT_SUCCESSFUL",
    userId,
    memberId: payment.memberId,
    paymentId: payment.id,
    details: `Payment of $${payment.amount} processed successfully`,
    ipAddress,
    userAgent,
    metadata: {
      amount: payment.amount,
      method: payment.method,
      processingTime: new Date().getTime() - payment.createdAt.getTime(),
    },
  });
};

// Log refund
export const logRefund = async (
  paymentId: string,
  userId: string,
  amount: number,
  reason: string,
  ipAddress?: string,
  userAgent?: string
) => {
  await logPaymentActivity({
    action: "PAYMENT_REFUNDED",
    userId,
    paymentId,
    details: `Refund of $${amount} processed for payment ${paymentId}. Reason: ${reason}`,
    ipAddress,
    userAgent,
    metadata: {
      refundAmount: amount,
      reason,
    },
  });
};

// Log recurring payment creation
export const logRecurringPaymentCreation = async (
  recurringPayment: any,
  userId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  await logPaymentActivity({
    action: "RECURRING_PAYMENT_CREATED",
    userId,
    memberId: recurringPayment.memberId,
    details: `Recurring payment of $${recurringPayment.amount} created with ${recurringPayment.frequency} frequency`,
    ipAddress,
    userAgent,
    metadata: {
      amount: recurringPayment.amount,
      frequency: recurringPayment.frequency,
      startDate: recurringPayment.startDate,
    },
  });
};

// Log installment plan creation
export const logInstallmentPlanCreation = async (
  installmentPlan: any,
  userId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  await logPaymentActivity({
    action: "INSTALLMENT_PLAN_CREATED",
    userId,
    memberId: installmentPlan.memberId,
    details: `Installment plan created: $${installmentPlan.totalAmount} in ${installmentPlan.numberOfInstallments} installments`,
    ipAddress,
    userAgent,
    metadata: {
      totalAmount: installmentPlan.totalAmount,
      numberOfInstallments: installmentPlan.numberOfInstallments,
      installmentAmount: installmentPlan.installmentAmount,
    },
  });
};

// Create compliance check record
export const createComplianceCheck = async (check: ComplianceCheck) => {
  try {
    await prisma.paymentComplianceCheck.create({
      data: {
        paymentId: check.paymentId,
        checkType: check.checkType,
        status: check.status,
        details: check.details,
        timestamp: check.timestamp,
      },
    });

    console.log(
      `Compliance check created: ${check.checkType} for payment ${check.paymentId}`
    );
  } catch (error) {
    console.error("Failed to create compliance check:", error);
    throw error;
  }
};

// Get audit trail for a specific payment
export const getPaymentAuditTrail = async (paymentId: string) => {
  try {
    const auditTrail = await prisma.paymentAuditLog.findMany({
      where: { paymentId },
      orderBy: { timestamp: "desc" },
      include: {
        User: true,
        Member: true,
      },
    });

    return auditTrail;
  } catch (error) {
    console.error("Failed to get payment audit trail:", error);
    throw error;
  }
};

// Get audit trail for a specific member
export const getMemberPaymentAuditTrail = async (
  memberId: string,
  limit = 100
) => {
  try {
    const auditTrail = await prisma.paymentAuditLog.findMany({
      where: { memberId },
      orderBy: { timestamp: "desc" },
      take: limit,
      include: {
        User: true,
        Payment: true,
      },
    });

    return auditTrail;
  } catch (error) {
    console.error("Failed to get member payment audit trail:", error);
    throw error;
  }
};

// Get audit trail for a specific user
export const getUserPaymentAuditTrail = async (userId: string, limit = 100) => {
  try {
    const auditTrail = await prisma.paymentAuditLog.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
      take: limit,
      include: {
        Member: true,
        Payment: true,
      },
    });

    return auditTrail;
  } catch (error) {
    console.error("Failed to get user payment audit trail:", error);
    throw error;
  }
};

// Get compliance report
export const getComplianceReport = async (startDate: Date, endDate: Date) => {
  try {
    const complianceChecks = await prisma.paymentComplianceCheck.findMany({
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { timestamp: "desc" },
      include: {
        Payment: {
          include: {
            Member: true,
          },
        },
      },
    });

    // Group by check type and status
    const report = {
      totalChecks: complianceChecks.length,
      byType: {} as Record<string, any>,
      byStatus: {} as Record<string, any>,
      failedChecks: complianceChecks.filter(
        (check) => check.status === "FAILED"
      ),
    };

    complianceChecks.forEach((check) => {
      // Group by check type
      if (!report.byType[check.checkType]) {
        report.byType[check.checkType] = {
          total: 0,
          passed: 0,
          failed: 0,
          pending: 0,
        };
      }
      report.byType[check.checkType].total++;
      report.byType[check.checkType][check.status.toLowerCase()]++;

      // Group by status
      if (!report.byStatus[check.status]) {
        report.byStatus[check.status] = 0;
      }
      report.byStatus[check.status]++;
    });

    return report;
  } catch (error) {
    console.error("Failed to get compliance report:", error);
    throw error;
  }
};

// Export audit data for compliance
export const exportAuditData = async (
  startDate: Date,
  endDate: Date,
  format: "CSV" | "JSON" = "CSV"
) => {
  try {
    const auditData = await prisma.paymentAuditLog.findMany({
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { timestamp: "asc" },
      include: {
        User: true,
        Member: true,
        Payment: true,
      },
    });

    if (format === "CSV") {
      return convertToCSV(auditData);
    } else {
      return auditData;
    }
  } catch (error) {
    console.error("Failed to export audit data:", error);
    throw error;
  }
};

// Convert audit data to CSV format
const convertToCSV = (data: any[]): string => {
  if (data.length === 0) return "";

  const headers = [
    "Timestamp",
    "Action",
    "User ID",
    "Member ID",
    "Payment ID",
    "Details",
    "IP Address",
    "User Agent",
  ];

  const csvRows = [headers.join(",")];

  data.forEach((row) => {
    const values = [
      row.timestamp,
      row.action,
      row.userId || "",
      row.memberId || "",
      row.paymentId || "",
      `"${row.details.replace(/"/g, '""')}"`,
      row.ipAddress || "",
      `"${(row.userAgent || "").replace(/"/g, '""')}"`,
    ];
    csvRows.push(values.join(","));
  });

  return csvRows.join("\n");
};

// Clean old audit logs (for data retention compliance)
export const cleanOldAuditLogs = async (daysToKeep: number = 2555) => {
  // 7 years default
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const deletedCount = await prisma.paymentAuditLog.deleteMany({
      where: {
        timestamp: {
          lt: cutoffDate,
        },
      },
    });

    console.log(
      `Cleaned ${deletedCount.count} old audit logs older than ${daysToKeep} days`
    );
    return deletedCount.count;
  } catch (error) {
    console.error("Failed to clean old audit logs:", error);
    throw error;
  }
};
