"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkInEquipment = exports.checkOutEquipment = exports.getMaintenanceLogs = exports.getEquipmentStats = exports.addMaintenanceLog = exports.updateEquipmentStatus = exports.deleteEquipment = exports.updateEquipment = exports.getSingleEquipment = exports.getAllEquipment = exports.addEquipment = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const addEquipment = async (req, res) => {
    try {
        const { name, type, category, brand, model, serialNumber, quantity, location, description, imageUrl, purchaseDate, warrantyExpiry, cost, } = req.body;
        if (!name || !type || !category || !quantity) {
            res.status(400).json({
                isSuccess: false,
                message: "Name, type, category, and quantity are required!",
            });
            return;
        }
        if (serialNumber) {
            const existingEquipment = await prisma_1.default.equipment.findUnique({
                where: { serialNumber },
            });
            if (existingEquipment) {
                res.status(400).json({
                    isSuccess: false,
                    message: "Equipment with this serial number already exists!",
                });
                return;
            }
        }
        const equipment = await prisma_1.default.equipment.create({
            data: {
                name,
                type,
                category,
                brand,
                model,
                serialNumber,
                quantity,
                available: quantity,
                inUse: 0,
                location,
                description,
                imageUrl,
                purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
                warrantyExpiry: warrantyExpiry ? new Date(warrantyExpiry) : null,
                cost: cost ? parseFloat(cost) : null,
            },
        });
        res.status(201).json({
            isSuccess: true,
            message: "Equipment successfully added",
            equipment,
        });
        return;
    }
    catch (error) {
        console.error("Error adding equipment:", error);
        res.status(500).json({
            isSuccess: false,
            message: "Server error!",
        });
        return;
    }
};
exports.addEquipment = addEquipment;
const getAllEquipment = async (req, res) => {
    try {
        const { page = 1, limit = 20, category, status, search, sortBy = "createdAt", sortOrder = "desc", } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const where = {};
        if (category)
            where.category = category;
        if (status)
            where.status = status;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { brand: { contains: search, mode: "insensitive" } },
                { model: { contains: search, mode: "insensitive" } },
                { serialNumber: { contains: search, mode: "insensitive" } },
            ];
        }
        const total = await prisma_1.default.equipment.count({ where });
        const equipment = await prisma_1.default.equipment.findMany({
            where,
            skip,
            take: limitNum,
            orderBy: { [sortBy]: sortOrder },
            include: {
                maintenanceLogs: {
                    orderBy: { performedAt: "desc" },
                    take: 1,
                },
            },
        });
        const stats = await prisma_1.default.equipment.groupBy({
            by: ["status"],
            _count: { status: true },
        });
        res.status(200).json({
            isSuccess: true,
            message: "Equipment list retrieved successfully",
            equipment,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
            stats: stats.reduce((acc, stat) => {
                acc[stat.status] = stat._count.status;
                return acc;
            }, {}),
        });
    }
    catch (error) {
        console.error("Error getting equipment:", error);
        res.status(500).json({
            isSuccess: false,
            message: "Server error!",
        });
        return;
    }
};
exports.getAllEquipment = getAllEquipment;
const getSingleEquipment = async (req, res) => {
    try {
        const { id } = req.params;
        const equipment = await prisma_1.default.equipment.findUnique({
            where: { id },
            include: {
                maintenanceLogs: {
                    orderBy: { performedAt: "desc" },
                },
            },
        });
        if (!equipment) {
            res.status(404).json({
                isSuccess: false,
                message: "Equipment not found!",
            });
            return;
        }
        res.status(200).json({
            isSuccess: true,
            message: "Equipment details retrieved successfully",
            equipment,
        });
        return;
    }
    catch (error) {
        console.error("Error getting equipment:", error);
        res.status(500).json({
            isSuccess: false,
            message: "Server error!",
        });
        return;
    }
};
exports.getSingleEquipment = getSingleEquipment;
const updateEquipment = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const existingEquipment = await prisma_1.default.equipment.findUnique({
            where: { id },
        });
        if (!existingEquipment) {
            res.status(404).json({
                isSuccess: false,
                message: "Equipment not found!",
            });
            return;
        }
        if (updateData.serialNumber &&
            updateData.serialNumber !== existingEquipment.serialNumber) {
            const duplicateSerial = await prisma_1.default.equipment.findUnique({
                where: { serialNumber: updateData.serialNumber },
            });
            if (duplicateSerial) {
                res.status(400).json({
                    isSuccess: false,
                    message: "Equipment with this serial number already exists!",
                });
                return;
            }
        }
        if (updateData.quantity &&
            updateData.quantity !== existingEquipment.quantity) {
            const difference = updateData.quantity - existingEquipment.quantity;
            updateData.available = existingEquipment.available + difference;
            if (updateData.available < 0) {
                updateData.available = 0;
            }
        }
        if (updateData.purchaseDate)
            updateData.purchaseDate = new Date(updateData.purchaseDate);
        if (updateData.warrantyExpiry)
            updateData.warrantyExpiry = new Date(updateData.warrantyExpiry);
        if (updateData.lastMaintenance)
            updateData.lastMaintenance = new Date(updateData.lastMaintenance);
        if (updateData.nextMaintenance)
            updateData.nextMaintenance = new Date(updateData.nextMaintenance);
        const updatedEquipment = await prisma_1.default.equipment.update({
            where: { id },
            data: updateData,
        });
        res.status(200).json({
            isSuccess: true,
            message: "Equipment updated successfully",
            equipment: updatedEquipment,
        });
        return;
    }
    catch (error) {
        console.error("Error updating equipment:", error);
        res.status(500).json({
            isSuccess: false,
            message: "Server error!",
        });
        return;
    }
};
exports.updateEquipment = updateEquipment;
const deleteEquipment = async (req, res) => {
    try {
        const { id } = req.params;
        const equipment = await prisma_1.default.equipment.findUnique({
            where: { id },
        });
        if (!equipment) {
            res.status(404).json({
                isSuccess: false,
                message: "Equipment not found!",
            });
            return;
        }
        if (equipment.inUse > 0) {
            res.status(400).json({
                isSuccess: false,
                message: "Cannot delete equipment that is currently in use!",
            });
            return;
        }
        await prisma_1.default.maintenanceLog.deleteMany({
            where: { equipmentId: id },
        });
        await prisma_1.default.equipment.delete({
            where: { id },
        });
        res.status(200).json({
            isSuccess: true,
            message: "Equipment deleted successfully",
        });
        return;
    }
    catch (error) {
        console.error("Error deleting equipment:", error);
        res.status(500).json({
            isSuccess: false,
            message: "Server error!",
        });
        return;
    }
};
exports.deleteEquipment = deleteEquipment;
const updateEquipmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, maintenance, nextMaintenance } = req.body;
        const equipment = await prisma_1.default.equipment.findUnique({
            where: { id },
        });
        if (!equipment) {
            res.status(404).json({
                isSuccess: false,
                message: "Equipment not found!",
            });
            return;
        }
        const updateData = { status };
        if (maintenance !== undefined)
            updateData.maintenance = maintenance;
        if (nextMaintenance)
            updateData.nextMaintenance = new Date(nextMaintenance);
        if (status === "OPERATIONAL") {
            updateData.maintenance = false;
        }
        const updatedEquipment = await prisma_1.default.equipment.update({
            where: { id },
            data: updateData,
        });
        res.status(200).json({
            isSuccess: true,
            message: "Equipment status updated successfully",
            equipment: updatedEquipment,
        });
        return;
    }
    catch (error) {
        console.error("Error updating equipment status:", error);
        res.status(500).json({
            isSuccess: false,
            message: "Server error!",
        });
        return;
    }
};
exports.updateEquipmentStatus = updateEquipmentStatus;
const addMaintenanceLog = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, description, cost, performedBy, nextDue } = req.body;
        if (!type || !description) {
            res.status(400).json({
                isSuccess: false,
                message: "Maintenance type and description are required!",
            });
            return;
        }
        const equipment = await prisma_1.default.equipment.findUnique({
            where: { id },
        });
        if (!equipment) {
            res.status(404).json({
                isSuccess: false,
                message: "Equipment not found!",
            });
            return;
        }
        const maintenanceLog = await prisma_1.default.maintenanceLog.create({
            data: {
                equipmentId: id,
                type,
                description,
                cost: cost ? parseFloat(cost) : null,
                performedBy,
                nextDue: nextDue ? new Date(nextDue) : null,
            },
        });
        await prisma_1.default.equipment.update({
            where: { id },
            data: {
                lastMaintenance: new Date(),
                nextMaintenance: nextDue ? new Date(nextDue) : null,
                maintenance: false,
                status: "OPERATIONAL",
            },
        });
        res.status(201).json({
            isSuccess: true,
            message: "Maintenance log added successfully",
            maintenanceLog,
        });
        return;
    }
    catch (error) {
        console.error("Error adding maintenance log:", error);
        res.status(500).json({
            isSuccess: false,
            message: "Server error!",
        });
        return;
    }
};
exports.addMaintenanceLog = addMaintenanceLog;
const getEquipmentStats = async (req, res) => {
    try {
        const totalEquipment = await prisma_1.default.equipment.count();
        const operationalEquipment = await prisma_1.default.equipment.count({
            where: { status: "OPERATIONAL" },
        });
        const maintenanceEquipment = await prisma_1.default.equipment.count({
            where: { status: "MAINTENANCE" },
        });
        const outOfServiceEquipment = await prisma_1.default.equipment.count({
            where: { status: "OUT_OF_SERVICE" },
        });
        const categoryStats = await prisma_1.default.equipment.groupBy({
            by: ["category"],
            _count: { category: true },
        });
        const totalValue = await prisma_1.default.equipment.aggregate({
            _sum: { cost: true },
        });
        const maintenanceDueEquipment = await prisma_1.default.equipment.findMany({
            where: {
                nextMaintenance: {
                    lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                },
                status: "OPERATIONAL",
            },
            select: {
                id: true,
                name: true,
                category: true,
                nextMaintenance: true,
                status: true,
            },
            orderBy: {
                nextMaintenance: 'asc',
            },
        });
        const recentMaintenanceLogs = await prisma_1.default.maintenanceLog.findMany({
            take: 10,
            orderBy: {
                performedAt: 'desc',
            },
            include: {
                equipment: {
                    select: {
                        id: true,
                        name: true,
                        category: true,
                    },
                },
            },
        });
        res.status(200).json({
            isSuccess: true,
            message: "Equipment statistics retrieved successfully",
            stats: {
                total: totalEquipment,
                operational: operationalEquipment,
                maintenance: maintenanceEquipment,
                outOfService: outOfServiceEquipment,
                categories: categoryStats,
                totalValue: totalValue._sum.cost || 0,
                maintenanceDue: maintenanceDueEquipment.length,
                recentMaintenance: recentMaintenanceLogs.length,
            },
            maintenanceDue: maintenanceDueEquipment,
            recentMaintenance: recentMaintenanceLogs,
        });
        return;
    }
    catch (error) {
        console.error("Error getting equipment stats:", error);
        res.status(500).json({
            isSuccess: false,
            message: "Server error!",
        });
        return;
    }
};
exports.getEquipmentStats = getEquipmentStats;
const getMaintenanceLogs = async (req, res) => {
    try {
        const { page = 1, limit = 20, equipmentId, type } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const whereClause = {};
        if (equipmentId) {
            whereClause.equipmentId = equipmentId;
        }
        if (type) {
            whereClause.type = type;
        }
        const [maintenanceLogs, total] = await Promise.all([
            prisma_1.default.maintenanceLog.findMany({
                where: whereClause,
                skip,
                take: Number(limit),
                orderBy: {
                    performedAt: 'desc',
                },
                include: {
                    equipment: {
                        select: {
                            id: true,
                            name: true,
                            category: true,
                            status: true,
                        },
                    },
                },
            }),
            prisma_1.default.maintenanceLog.count({ where: whereClause }),
        ]);
        res.status(200).json({
            isSuccess: true,
            message: "Maintenance logs retrieved successfully",
            data: maintenanceLogs,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        });
        return;
    }
    catch (error) {
        console.error("Error getting maintenance logs:", error);
        res.status(500).json({
            isSuccess: false,
            message: "Server error!",
        });
        return;
    }
};
exports.getMaintenanceLogs = getMaintenanceLogs;
const checkOutEquipment = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity = 1 } = req.body;
        const equipment = await prisma_1.default.equipment.findUnique({
            where: { id },
        });
        if (!equipment) {
            res.status(404).json({
                isSuccess: false,
                message: "Equipment not found!",
            });
            return;
        }
        if (equipment.status !== "OPERATIONAL") {
            res.status(400).json({
                isSuccess: false,
                message: "Equipment is not available for use!",
            });
            return;
        }
        if (equipment.available < quantity) {
            res.status(400).json({
                isSuccess: false,
                message: "Not enough equipment available!",
            });
            return;
        }
        const updatedEquipment = await prisma_1.default.equipment.update({
            where: { id },
            data: {
                available: equipment.available - quantity,
                inUse: equipment.inUse + quantity,
            },
        });
        res.status(200).json({
            isSuccess: true,
            message: "Equipment checked out successfully",
            equipment: updatedEquipment,
        });
        return;
    }
    catch (error) {
        console.error("Error checking out equipment:", error);
        res.status(500).json({
            isSuccess: false,
            message: "Server error!",
        });
        return;
    }
};
exports.checkOutEquipment = checkOutEquipment;
const checkInEquipment = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity = 1 } = req.body;
        const equipment = await prisma_1.default.equipment.findUnique({
            where: { id },
        });
        if (!equipment) {
            res.status(404).json({
                isSuccess: false,
                message: "Equipment not found!",
            });
            return;
        }
        if (equipment.inUse < quantity) {
            res.status(400).json({
                isSuccess: false,
                message: "Cannot check in more equipment than is currently in use!",
            });
            return;
        }
        const updatedEquipment = await prisma_1.default.equipment.update({
            where: { id },
            data: {
                available: equipment.available + quantity,
                inUse: equipment.inUse - quantity,
            },
        });
        res.status(200).json({
            isSuccess: true,
            message: "Equipment checked in successfully",
            equipment: updatedEquipment,
        });
        return;
    }
    catch (error) {
        console.error("Error checking in equipment:", error);
        res.status(500).json({
            isSuccess: false,
            message: "Server error!",
        });
        return;
    }
};
exports.checkInEquipment = checkInEquipment;
//# sourceMappingURL=equipment.controller.js.map