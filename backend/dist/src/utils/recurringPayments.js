"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelRecurringPayment = exports.resumeRecurringPayment = exports.pauseRecurringPayment = exports.processInstallmentPayments = exports.processRecurringPayments = exports.createInstallmentPlan = exports.createRecurringPayment = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const paymentNotifications_1 = require("./paymentNotifications");
const createRecurringPayment = async (config) => {
    try {
        const recurringPayment = await prisma_1.default.recurringPayment.create({
            data: {
                id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                memberId: config.memberId,
                amount: config.amount,
                frequency: config.frequency,
                startDate: config.startDate,
                endDate: config.endDate,
                maxAttempts: config.maxAttempts || 3,
                retryDelay: config.retryDelay || 3,
                autoRetry: config.autoRetry !== false,
                description: config.description,
                status: "ACTIVE",
                nextPaymentDate: calculateNextPaymentDate(config.startDate, config.frequency),
            },
        });
        console.log(`Recurring payment created: ${recurringPayment.id}`);
        return recurringPayment;
    }
    catch (error) {
        console.error("Failed to create recurring payment:", error);
        throw error;
    }
};
exports.createRecurringPayment = createRecurringPayment;
const createInstallmentPlan = async (plan) => {
    try {
        const installmentPlan = await prisma_1.default.installmentPlan.create({
            data: {
                id: `inst_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                memberId: plan.memberId,
                totalAmount: plan.totalAmount,
                numberOfInstallments: plan.numberOfInstallments,
                installmentAmount: plan.installmentAmount,
                startDate: plan.startDate,
                dueDayOfMonth: plan.dueDayOfMonth,
                description: plan.description,
                status: "ACTIVE",
                currentInstallment: 1,
                nextDueDate: calculateInstallmentDueDate(plan.startDate, plan.dueDayOfMonth),
            },
        });
        console.log(`Installment plan created: ${installmentPlan.id}`);
        return installmentPlan;
    }
    catch (error) {
        console.error("Failed to create installment plan:", error);
        throw error;
    }
};
exports.createInstallmentPlan = createInstallmentPlan;
const processRecurringPayments = async () => {
    try {
        const today = new Date();
        const duePayments = await prisma_1.default.recurringPayment.findMany({
            where: {
                status: "ACTIVE",
                nextPaymentDate: {
                    lte: today,
                },
                endDate: {
                    gte: today,
                },
            },
            include: {
                Member: true,
            },
        });
        console.log(`Processing ${duePayments.length} recurring payments`);
        for (const recurringPayment of duePayments) {
            try {
                const payment = await prisma_1.default.payment.create({
                    data: {
                        amount: recurringPayment.amount,
                        memberId: recurringPayment.memberId,
                        method: "RECURRING",
                        description: recurringPayment.description ||
                            `Recurring payment - ${recurringPayment.frequency}`,
                        reference: `REC-${recurringPayment.id}`,
                        status: "PENDING",
                    },
                });
                await prisma_1.default.recurringPayment.update({
                    where: { id: recurringPayment.id },
                    data: {
                        nextPaymentDate: calculateNextPaymentDate(recurringPayment.nextPaymentDate, recurringPayment.frequency),
                        lastProcessedDate: today,
                        attemptCount: 0,
                    },
                });
                console.log(`Recurring payment processed successfully: ${payment.id}`);
            }
            catch (error) {
                console.error(`Failed to process recurring payment ${recurringPayment.id}:`, error);
                await handleFailedRecurringPayment(recurringPayment, error instanceof Error ? error.message : "Unknown error");
            }
        }
    }
    catch (error) {
        console.error("Error processing recurring payments:", error);
        throw error;
    }
};
exports.processRecurringPayments = processRecurringPayments;
const processInstallmentPayments = async () => {
    try {
        const today = new Date();
        const dueInstallments = await prisma_1.default.installmentPlan.findMany({
            where: {
                status: "ACTIVE",
                nextDueDate: {
                    lte: today,
                },
            },
            include: {
                Member: true,
            },
        });
        console.log(`Processing ${dueInstallments.length} installment payments`);
        for (const installmentPlan of dueInstallments) {
            try {
                const payment = await prisma_1.default.payment.create({
                    data: {
                        amount: installmentPlan.installmentAmount,
                        memberId: installmentPlan.memberId,
                        method: "INSTALLMENT",
                        description: `Installment ${installmentPlan.currentInstallment} of ${installmentPlan.numberOfInstallments}`,
                        reference: `INST-${installmentPlan.id}-${installmentPlan.currentInstallment}`,
                        status: "PENDING",
                    },
                });
                const isLastInstallment = installmentPlan.currentInstallment >=
                    installmentPlan.numberOfInstallments;
                await prisma_1.default.installmentPlan.update({
                    where: { id: installmentPlan.id },
                    data: {
                        currentInstallment: installmentPlan.currentInstallment + 1,
                        nextDueDate: isLastInstallment
                            ? null
                            : calculateInstallmentDueDate(installmentPlan.nextDueDate || new Date(), installmentPlan.dueDayOfMonth || undefined),
                        status: isLastInstallment ? "COMPLETED" : "ACTIVE",
                        lastProcessedDate: today,
                    },
                });
                console.log(`Installment payment processed: ${payment.id}`);
            }
            catch (error) {
                console.error(`Failed to process installment ${installmentPlan.id}:`, error);
                await handleFailedInstallment(installmentPlan, error instanceof Error ? error.message : "Unknown error");
            }
        }
    }
    catch (error) {
        console.error("Error processing installment payments:", error);
        throw error;
    }
};
exports.processInstallmentPayments = processInstallmentPayments;
const handleFailedRecurringPayment = async (recurringPayment, errorMessage) => {
    try {
        const attemptCount = (recurringPayment.attemptCount || 0) + 1;
        const maxAttempts = recurringPayment.maxAttempts || 3;
        if (attemptCount >= maxAttempts) {
            await prisma_1.default.recurringPayment.update({
                where: { id: recurringPayment.id },
                data: {
                    status: "FAILED",
                    attemptCount,
                    lastError: errorMessage,
                },
            });
            await (0, paymentNotifications_1.sendFailedPaymentNotification)({ Member: recurringPayment.Member }, errorMessage);
        }
        else {
            const retryDate = new Date();
            retryDate.setDate(retryDate.getDate() + (recurringPayment.retryDelay || 3));
            await prisma_1.default.recurringPayment.update({
                where: { id: recurringPayment.id },
                data: {
                    attemptCount,
                    nextPaymentDate: retryDate,
                    lastError: errorMessage,
                },
            });
        }
    }
    catch (error) {
        console.error("Error handling failed recurring payment:", error);
    }
};
const handleFailedInstallment = async (installmentPlan, errorMessage) => {
    try {
        await prisma_1.default.installmentPlan.update({
            where: { id: installmentPlan.id },
            data: {
                status: "OVERDUE",
                lastError: errorMessage,
            },
        });
        const daysOverdue = Math.ceil((new Date().getTime() - installmentPlan.nextDueDate.getTime()) /
            (1000 * 60 * 60 * 24));
        await (0, paymentNotifications_1.sendPaymentReminder)(installmentPlan.Member, installmentPlan.installmentAmount, installmentPlan.nextDueDate, daysOverdue);
    }
    catch (error) {
        console.error("Error handling failed installment:", error);
    }
};
const calculateNextPaymentDate = (currentDate, frequency) => {
    const nextDate = new Date(currentDate);
    switch (frequency) {
        case "daily":
            nextDate.setDate(nextDate.getDate() + 1);
            break;
        case "weekly":
            nextDate.setDate(nextDate.getDate() + 7);
            break;
        case "monthly":
            nextDate.setMonth(nextDate.getMonth() + 1);
            break;
        case "yearly":
            nextDate.setFullYear(nextDate.getFullYear() + 1);
            break;
        default:
            nextDate.setMonth(nextDate.getMonth() + 1);
    }
    return nextDate;
};
const calculateInstallmentDueDate = (currentDate, dueDayOfMonth) => {
    const nextDate = new Date(currentDate);
    if (dueDayOfMonth) {
        nextDate.setDate(dueDayOfMonth);
        if (nextDate <= currentDate) {
            nextDate.setMonth(nextDate.getMonth() + 1);
            nextDate.setDate(dueDayOfMonth);
        }
    }
    else {
        nextDate.setMonth(nextDate.getMonth() + 1);
    }
    return nextDate;
};
const pauseRecurringPayment = async (recurringPaymentId) => {
    try {
        await prisma_1.default.recurringPayment.update({
            where: { id: recurringPaymentId },
            data: { status: "PAUSED" },
        });
        console.log(`Recurring payment paused: ${recurringPaymentId}`);
    }
    catch (error) {
        console.error("Failed to pause recurring payment:", error);
        throw error;
    }
};
exports.pauseRecurringPayment = pauseRecurringPayment;
const resumeRecurringPayment = async (recurringPaymentId) => {
    try {
        const recurringPayment = await prisma_1.default.recurringPayment.findUnique({
            where: { id: recurringPaymentId },
        });
        if (!recurringPayment) {
            throw new Error("Recurring payment not found");
        }
        await prisma_1.default.recurringPayment.update({
            where: { id: recurringPaymentId },
            data: {
                status: "ACTIVE",
                nextPaymentDate: calculateNextPaymentDate(new Date(), recurringPayment.frequency),
            },
        });
        console.log(`Recurring payment resumed: ${recurringPaymentId}`);
    }
    catch (error) {
        console.error("Failed to resume recurring payment:", error);
        throw error;
    }
};
exports.resumeRecurringPayment = resumeRecurringPayment;
const cancelRecurringPayment = async (recurringPaymentId) => {
    try {
        await prisma_1.default.recurringPayment.update({
            where: { id: recurringPaymentId },
            data: { status: "CANCELLED" },
        });
        console.log(`Recurring payment cancelled: ${recurringPaymentId}`);
    }
    catch (error) {
        console.error("Failed to cancel recurring payment:", error);
        throw error;
    }
};
exports.cancelRecurringPayment = cancelRecurringPayment;
//# sourceMappingURL=recurringPayments.js.map