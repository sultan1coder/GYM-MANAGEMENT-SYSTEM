"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReports = exports.generateInvoice = exports.getHistoryOfSpecificMember = exports.getSpecificPayment = exports.getAllPayment = exports.deletePayment = exports.updatePayment = exports.createPayment = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const createPayment = async (req, res) => {
    try {
        const { amount, memberId, method, status, description, reference, currency, taxAmount, processingFee, lateFees, gatewayTransactionId, gatewayResponse, } = req.body;
        const member = await prisma_1.default.member.findUnique({
            where: { id: memberId },
        });
        if (!member) {
            res.status(400).json({
                isSuccess: false,
                message: "Member not found",
            });
            return;
        }
        if (amount <= 0) {
            res.status(400).json({
                isSuccess: false,
                message: "Payment amount must be greater than 0",
            });
            return;
        }
        if (currency && !["USD", "EUR", "GBP", "CAD"].includes(currency)) {
            res.status(400).json({
                isSuccess: false,
                message: "Invalid currency. Supported currencies: USD, EUR, GBP, CAD",
            });
            return;
        }
        if (taxAmount && taxAmount < 0) {
            res.status(400).json({
                isSuccess: false,
                message: "Tax amount cannot be negative",
            });
            return;
        }
        if (processingFee && processingFee < 0) {
            res.status(400).json({
                isSuccess: false,
                message: "Processing fee cannot be negative",
            });
            return;
        }
        if (lateFees && lateFees < 0) {
            res.status(400).json({
                isSuccess: false,
                message: "Late fees cannot be negative",
            });
            return;
        }
        const payment = await prisma_1.default.payment.create({
            data: {
                amount,
                memberId,
                method,
                description,
                reference,
                currency: currency || "USD",
                taxAmount: taxAmount || 0,
                processingFee: processingFee || 0,
                lateFees: lateFees || 0,
                gatewayTransactionId,
                gatewayResponse,
                status: status || "PENDING",
            },
            include: {
                Member: true,
            },
        });
        res.status(200).json({
            isSuccess: true,
            payment,
        });
    }
    catch (error) {
        res.status(500).json({
            isSuccess: false,
            error: JSON.stringify(error),
        });
    }
};
exports.createPayment = createPayment;
const updatePayment = async (req, res) => {
    try {
        const paymentId = req.params.id;
        const updateData = req.body;
        console.log("Update Payment Request:", { paymentId, updateData });
        const existingPayment = await prisma_1.default.payment.findUnique({
            where: { id: paymentId },
        });
        if (!existingPayment) {
            res.status(404).json({
                isSuccess: false,
                message: "Payment not found",
            });
            return;
        }
        if (updateData.amount !== undefined && updateData.amount <= 0) {
            res.status(400).json({
                isSuccess: false,
                message: "Payment amount must be greater than 0",
            });
            return;
        }
        if (updateData.status &&
            !["PENDING", "COMPLETED", "FAILED", "CANCELLED", "REFUNDED"].includes(updateData.status)) {
            res.status(400).json({
                isSuccess: false,
                message: "Invalid payment status",
            });
            return;
        }
        if (updateData.currency &&
            !["USD", "EUR", "GBP", "CAD"].includes(updateData.currency)) {
            res.status(400).json({
                isSuccess: false,
                message: "Invalid currency. Supported currencies: USD, EUR, GBP, CAD",
            });
            return;
        }
        if (updateData.taxAmount !== undefined && updateData.taxAmount < 0) {
            res.status(400).json({
                isSuccess: false,
                message: "Tax amount cannot be negative",
            });
            return;
        }
        if (updateData.processingFee !== undefined &&
            updateData.processingFee < 0) {
            res.status(400).json({
                isSuccess: false,
                message: "Processing fee cannot be negative",
            });
            return;
        }
        if (updateData.lateFees !== undefined && updateData.lateFees < 0) {
            res.status(400).json({
                isSuccess: false,
                message: "Late fees cannot be negative",
            });
            return;
        }
        const updatedPayment = await prisma_1.default.payment.update({
            where: { id: paymentId },
            data: updateData,
            include: {
                Member: true,
            },
        });
        res.status(200).json({
            isSuccess: true,
            payment: updatedPayment,
        });
    }
    catch (error) {
        res.status(500).json({
            isSuccess: false,
            error: JSON.stringify(error),
        });
    }
};
exports.updatePayment = updatePayment;
const deletePayment = async (req, res) => {
    try {
        const paymentId = req.params.id;
        const existingPayment = await prisma_1.default.payment.findUnique({
            where: { id: paymentId },
        });
        if (!existingPayment) {
            res.status(404).json({
                isSuccess: false,
                message: "Payment not found",
            });
            return;
        }
        if (existingPayment.status === "COMPLETED") {
            res.status(400).json({
                isSuccess: false,
                message: "Cannot delete completed payments",
            });
            return;
        }
        await prisma_1.default.payment.delete({
            where: { id: paymentId },
        });
        res.status(200).json({
            isSuccess: true,
            message: "Payment deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            isSuccess: false,
            error: JSON.stringify(error),
        });
    }
};
exports.deletePayment = deletePayment;
const getAllPayment = async (req, res) => {
    try {
        const payment = await prisma_1.default.payment.findMany({
            include: {
                Member: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json({
            isSuccess: true,
            message: "Fetched All payments",
            payment,
        });
    }
    catch (error) {
        res.status(500).json({
            isSuccess: false,
            error: JSON.stringify(error),
        });
    }
};
exports.getAllPayment = getAllPayment;
const getSpecificPayment = async (req, res) => {
    try {
        const paymentId = req.params.id;
        const payment = await prisma_1.default.payment.findFirst({
            where: {
                id: paymentId,
            },
            include: {
                Member: true,
            },
        });
        if (!payment) {
            res.status(404).json({
                isSuccess: false,
                message: "Payment is not found!",
            });
            return;
        }
        res.status(200).json({
            isSuccess: true,
            payment,
        });
    }
    catch (error) {
        res.status(500).json({
            isSuccess: false,
            error: JSON.stringify(error),
        });
    }
};
exports.getSpecificPayment = getSpecificPayment;
const getHistoryOfSpecificMember = async (req, res) => {
    try {
        const memberId = req.params.memberId;
        const payments = await prisma_1.default.payment.findMany({
            where: {
                memberId: memberId,
            },
            include: {
                Member: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json({
            isSuccess: true,
            payments,
        });
    }
    catch (error) {
        res.status(500).json({
            isSuccess: false,
            error: JSON.stringify(error),
        });
    }
};
exports.getHistoryOfSpecificMember = getHistoryOfSpecificMember;
const generateInvoice = async (req, res) => {
    try {
        const { memberId, amount, details } = req.body;
        const member = await prisma_1.default.member.findUnique({
            where: { id: memberId },
        });
        if (!member) {
            res.status(400).json({
                isSuccess: false,
                message: "Member not found",
            });
            return;
        }
        if (amount <= 0) {
            res.status(400).json({
                isSuccess: false,
                message: "Invoice amount must be greater than 0",
            });
            return;
        }
        const invoice = await prisma_1.default.invoice.create({
            data: {
                memberId,
                amount,
                details,
            },
            include: {
                Member: true,
            },
        });
        res.status(200).json({
            isSuccess: true,
            invoice,
        });
    }
    catch (error) {
        res.status(500).json({
            isSuccess: false,
            error: JSON.stringify(error),
        });
    }
};
exports.generateInvoice = generateInvoice;
const getReports = async (req, res) => {
    try {
        const totalRevenue = await prisma_1.default.payment.aggregate({
            where: {
                status: "COMPLETED",
            },
            _sum: {
                amount: true,
            },
        });
        const paymentCounts = await prisma_1.default.payment.groupBy({
            by: ["status"],
            _count: {
                status: true,
            },
        });
        const currentYear = new Date().getFullYear();
        const monthlyRevenue = await prisma_1.default.payment.groupBy({
            by: ["createdAt"],
            where: {
                status: "COMPLETED",
                createdAt: {
                    gte: new Date(currentYear, 0, 1),
                    lt: new Date(currentYear + 1, 0, 1),
                },
            },
            _sum: {
                amount: true,
            },
        });
        const methodDistribution = await prisma_1.default.payment.groupBy({
            by: ["method"],
            where: {
                status: "COMPLETED",
            },
            _sum: {
                amount: true,
            },
            _count: {
                method: true,
            },
        });
        res.status(200).json({
            isSuccess: true,
            reports: {
                totalRevenue: totalRevenue._sum.amount || 0,
                paymentCounts,
                monthlyRevenue,
                methodDistribution,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            isSuccess: false,
            error: JSON.stringify(error),
        });
    }
};
exports.getReports = getReports;
//# sourceMappingURL=payment.controller.js.map