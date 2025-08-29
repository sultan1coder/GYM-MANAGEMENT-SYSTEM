"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanOldAuditLogs = exports.exportAuditData = exports.getComplianceReport = exports.getUserPaymentAuditTrail = exports.getMemberPaymentAuditTrail = exports.getPaymentAuditTrail = exports.createComplianceCheck = exports.logInstallmentPlanCreation = exports.logRecurringPaymentCreation = exports.logRefund = exports.logSuccessfulPayment = exports.logFailedPaymentAttempt = exports.logPaymentAccess = exports.logPaymentStatusChange = exports.logPaymentDeletion = exports.logPaymentUpdate = exports.logPaymentCreation = exports.logPaymentActivity = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const logPaymentActivity = async (entry) => {
    try {
        const data = {
            action: entry.action,
            details: entry.details,
            timestamp: new Date(),
        };
        if (entry.userId)
            data.userId = entry.userId;
        if (entry.memberId)
            data.memberId = entry.memberId;
        if (entry.paymentId)
            data.paymentId = entry.paymentId;
        if (entry.ipAddress)
            data.ipAddress = entry.ipAddress;
        if (entry.userAgent)
            data.userAgent = entry.userAgent;
        if (entry.metadata)
            data.metadata = entry.metadata;
        await prisma_1.default.paymentAuditLog.create({ data });
        console.log(`Payment audit log created: ${entry.action}`);
    }
    catch (error) {
        console.error("Failed to create payment audit log:", error);
    }
};
exports.logPaymentActivity = logPaymentActivity;
const logPaymentCreation = async (payment, userId, ipAddress, userAgent) => {
    await (0, exports.logPaymentActivity)({
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
exports.logPaymentCreation = logPaymentCreation;
const logPaymentUpdate = async (paymentId, userId, changes, ipAddress, userAgent) => {
    await (0, exports.logPaymentActivity)({
        action: "PAYMENT_UPDATED",
        userId,
        paymentId,
        details: `Payment ${paymentId} updated with changes: ${JSON.stringify(changes)}`,
        ipAddress,
        userAgent,
        metadata: { changes },
    });
};
exports.logPaymentUpdate = logPaymentUpdate;
const logPaymentDeletion = async (paymentId, userId, reason, ipAddress, userAgent) => {
    await (0, exports.logPaymentActivity)({
        action: "PAYMENT_DELETED",
        userId,
        paymentId,
        details: `Payment ${paymentId} deleted. Reason: ${reason}`,
        ipAddress,
        userAgent,
        metadata: { reason },
    });
};
exports.logPaymentDeletion = logPaymentDeletion;
const logPaymentStatusChange = async (paymentId, userId, oldStatus, newStatus, reason, ipAddress, userAgent) => {
    await (0, exports.logPaymentActivity)({
        action: "PAYMENT_STATUS_CHANGED",
        userId,
        paymentId,
        details: `Payment ${paymentId} status changed from ${oldStatus} to ${newStatus}${reason ? `. Reason: ${reason}` : ""}`,
        ipAddress,
        userAgent,
        metadata: {
            oldStatus,
            newStatus,
            reason,
        },
    });
};
exports.logPaymentStatusChange = logPaymentStatusChange;
const logPaymentAccess = async (paymentId, userId, accessType, ipAddress, userAgent) => {
    await (0, exports.logPaymentActivity)({
        action: `PAYMENT_${accessType}`,
        userId,
        paymentId,
        details: `Payment ${paymentId} accessed for ${accessType.toLowerCase()}`,
        ipAddress,
        userAgent,
        metadata: { accessType },
    });
};
exports.logPaymentAccess = logPaymentAccess;
const logFailedPaymentAttempt = async (memberId, amount, method, error, ipAddress, userAgent) => {
    await (0, exports.logPaymentActivity)({
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
exports.logFailedPaymentAttempt = logFailedPaymentAttempt;
const logSuccessfulPayment = async (payment, userId, ipAddress, userAgent) => {
    await (0, exports.logPaymentActivity)({
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
exports.logSuccessfulPayment = logSuccessfulPayment;
const logRefund = async (paymentId, userId, amount, reason, ipAddress, userAgent) => {
    await (0, exports.logPaymentActivity)({
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
exports.logRefund = logRefund;
const logRecurringPaymentCreation = async (recurringPayment, userId, ipAddress, userAgent) => {
    await (0, exports.logPaymentActivity)({
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
exports.logRecurringPaymentCreation = logRecurringPaymentCreation;
const logInstallmentPlanCreation = async (installmentPlan, userId, ipAddress, userAgent) => {
    await (0, exports.logPaymentActivity)({
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
exports.logInstallmentPlanCreation = logInstallmentPlanCreation;
const createComplianceCheck = async (check) => {
    try {
        await prisma_1.default.paymentComplianceCheck.create({
            data: {
                id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                paymentId: check.paymentId,
                checkType: check.checkType,
                status: check.status,
                details: check.checkType,
                timestamp: check.timestamp,
            },
        });
        console.log(`Compliance check created: ${check.checkType} for payment ${check.paymentId}`);
    }
    catch (error) {
        console.error("Failed to create compliance check:", error);
        throw error;
    }
};
exports.createComplianceCheck = createComplianceCheck;
const getPaymentAuditTrail = async (paymentId) => {
    try {
        const auditTrail = await prisma_1.default.paymentAuditLog.findMany({
            where: { paymentId },
            orderBy: { timestamp: "desc" },
            include: {
                User: true,
                Member: true,
            },
        });
        return auditTrail;
    }
    catch (error) {
        console.error("Failed to get payment audit trail:", error);
        throw error;
    }
};
exports.getPaymentAuditTrail = getPaymentAuditTrail;
const getMemberPaymentAuditTrail = async (memberId, limit = 100) => {
    try {
        const auditTrail = await prisma_1.default.paymentAuditLog.findMany({
            where: { memberId },
            orderBy: { timestamp: "desc" },
            take: limit,
            include: {
                User: true,
                Payment: true,
            },
        });
        return auditTrail;
    }
    catch (error) {
        console.error("Failed to get member payment audit trail:", error);
        throw error;
    }
};
exports.getMemberPaymentAuditTrail = getMemberPaymentAuditTrail;
const getUserPaymentAuditTrail = async (userId, limit = 100) => {
    try {
        const auditTrail = await prisma_1.default.paymentAuditLog.findMany({
            where: { userId },
            orderBy: { timestamp: "desc" },
            take: limit,
            include: {
                Member: true,
                Payment: true,
            },
        });
        return auditTrail;
    }
    catch (error) {
        console.error("Failed to get user payment audit trail:", error);
        throw error;
    }
};
exports.getUserPaymentAuditTrail = getUserPaymentAuditTrail;
const getComplianceReport = async (startDate, endDate) => {
    try {
        const complianceChecks = await prisma_1.default.paymentComplianceCheck.findMany({
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
        const report = {
            totalChecks: complianceChecks.length,
            byType: {},
            byStatus: {},
            failedChecks: complianceChecks.filter((check) => check.status === "FAILED"),
        };
        complianceChecks.forEach((check) => {
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
            if (!report.byStatus[check.status]) {
                report.byStatus[check.status] = 0;
            }
            report.byStatus[check.status]++;
        });
        return report;
    }
    catch (error) {
        console.error("Failed to get compliance report:", error);
        throw error;
    }
};
exports.getComplianceReport = getComplianceReport;
const exportAuditData = async (startDate, endDate, format = "CSV") => {
    try {
        const auditData = await prisma_1.default.paymentAuditLog.findMany({
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
        }
        else {
            return auditData;
        }
    }
    catch (error) {
        console.error("Failed to export audit data:", error);
        throw error;
    }
};
exports.exportAuditData = exportAuditData;
const convertToCSV = (data) => {
    if (data.length === 0)
        return "";
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
const cleanOldAuditLogs = async (daysToKeep = 2555) => {
    try {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        const deletedCount = await prisma_1.default.paymentAuditLog.deleteMany({
            where: {
                timestamp: {
                    lt: cutoffDate,
                },
            },
        });
        console.log(`Cleaned ${deletedCount.count} old audit logs older than ${daysToKeep} days`);
        return deletedCount.count;
    }
    catch (error) {
        console.error("Failed to clean old audit logs:", error);
        throw error;
    }
};
exports.cleanOldAuditLogs = cleanOldAuditLogs;
//# sourceMappingURL=paymentAudit.js.map