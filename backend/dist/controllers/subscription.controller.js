"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsubscribeMember = exports.subscribeMember = exports.deletePlan = exports.updatePlan = exports.getSinglePlan = exports.createPlan = exports.getAllPlans = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getAllPlans = async (req, res) => {
    try {
        const plans = await prisma_1.default.membershipPlan.findMany();
        res.status(200).json({
            isSuccess: true,
            message: "All membership plans are fetched",
            plans,
        });
    }
    catch (error) {
        res.status(500).json({
            isSuccess: false,
            error: JSON.stringify(error),
        });
    }
};
exports.getAllPlans = getAllPlans;
const createPlan = async (req, res) => {
    try {
        const { name, price, duration } = req.body;
        if (!name || !price || !duration) {
            res.status(400).json({
                isSuccess: false,
                message: "All fields required!",
            });
            return;
        }
        const plan = await prisma_1.default.membershipPlan.create({
            data: {
                name,
                price,
                duration,
            },
        });
        res.status(200).json({
            message: "Successfully created new membership plan",
            plan,
        });
    }
    catch (error) {
        res.status(500).json({
            isSuccess: false,
            error: JSON.stringify(error),
        });
    }
};
exports.createPlan = createPlan;
const getSinglePlan = async (req, res) => {
    try {
        const plan = await prisma_1.default.membershipPlan.findUnique({
            where: {
                id: req.params.id,
            },
        });
        plan
            ? res.status(200).json({ plan })
            : res.status(404).json({ Error: "Plan not found!" });
    }
    catch (error) {
        res.status(500).json({
            isSuccess: false,
            error: JSON.stringify(error),
        });
    }
};
exports.getSinglePlan = getSinglePlan;
const updatePlan = async (req, res) => {
    try {
        const { plan_id, name, price, duration } = req.body;
        const plan = await prisma_1.default.membershipPlan.findFirst({
            where: {
                id: plan_id,
            },
        });
        if (!plan) {
            res.status(404).json({
                isSuccess: false,
                message: "Plan not found!",
            });
            return;
        }
        const updatePlan = await prisma_1.default.membershipPlan.update({
            where: {
                id: plan.id,
            },
            data: {
                name,
                price,
                duration,
            },
        });
        res.status(200).json({
            isSuccess: true,
            message: "Successfully updated membership plan",
            updatePlan,
        });
    }
    catch (error) {
        res.status(500).json({
            isSuccess: false,
            error: JSON.stringify(error),
        });
    }
};
exports.updatePlan = updatePlan;
const deletePlan = async (req, res) => {
    try {
        const planId = req.params.id;
        const plan = await prisma_1.default.membershipPlan.findFirst({
            where: {
                id: planId,
            },
        });
        if (!plan) {
            res.status(404).json({
                isSuccess: false,
                message: "membership plan not found!",
            });
            return;
        }
        const deletePlan = await prisma_1.default.membershipPlan.delete({
            where: {
                id: plan.id,
            },
        });
        res.status(200).json({
            isSuccess: true,
            message: "Membership plan successfully deleted!",
            deletePlan,
        });
    }
    catch (error) {
        res.status(500).json({
            isSuccess: false,
            error: JSON.stringify(error),
        });
    }
};
exports.deletePlan = deletePlan;
const subscribeMember = async (req, res) => {
    try {
        const memberId = req.params.id;
        const { planId } = req.body;
        const plan = await prisma_1.default.membershipPlan.findUnique({
            where: {
                id: planId,
            },
        });
        if (!plan) {
            res.status(404).json({
                isSuccess: false,
                message: "membership plan not found!",
            });
            return;
        }
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + plan.duration);
        const subscription = await prisma_1.default.subscription.create({
            data: {
                memberId,
                planId,
                endDate,
            },
        });
        res.status(201).json({
            isSuccess: true,
            subscription,
        });
    }
    catch (error) {
        res.status(500).json({
            isSuccess: false,
            error: JSON.stringify(error),
        });
    }
};
exports.subscribeMember = subscribeMember;
const unsubscribeMember = async (req, res) => {
    try {
        await prisma_1.default.subscription.deleteMany({
            where: {
                memberId: req.params.id,
            },
        });
        res.status(200).json({
            massage: "Successfully Unsubscribed a member",
        });
    }
    catch (error) {
        res.status(500).json({
            isSuccess: false,
            error: JSON.stringify(error),
        });
    }
};
exports.unsubscribeMember = unsubscribeMember;
//# sourceMappingURL=subscription.controller.js.map