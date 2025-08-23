import { Request, Response } from "express";
import prisma from "../lib/prisma";

// Add new equipment
export const addEquipment = async (req: Request, res: Response) => {
  try {
    const {
      name,
      type,
      category,
      brand,
      model,
      serialNumber,
      quantity,
      location,
      description,
      imageUrl,
      purchaseDate,
      warrantyExpiry,
      cost,
    } = req.body;

    if (!name || !type || !category || !quantity) {
      res.status(400).json({
        isSuccess: false,
        message: "Name, type, category, and quantity are required!",
      });
      return;
    }

    // Check if serial number already exists
    if (serialNumber) {
      const existingEquipment = await prisma.equipment.findUnique({
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

    const equipment = await prisma.equipment.create({
      data: {
        name,
        type,
        category,
        brand,
        model,
        serialNumber,
        quantity,
        available: quantity, // Initially all equipment is available
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
  } catch (error) {
    console.error("Error adding equipment:", error);
    res.status(500).json({
      isSuccess: false,
      message: "Server error!",
    });
    return;
  }
};

// List all equipment with filtering and pagination
export const getAllEquipment = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      status,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {};

    if (category) where.category = category;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { brand: { contains: search as string, mode: "insensitive" } },
        { model: { contains: search as string, mode: "insensitive" } },
        { serialNumber: { contains: search as string, mode: "insensitive" } },
      ];
    }

    // Get total count
    const total = await prisma.equipment.count({ where });

    // Get equipment with pagination
    const equipment = await prisma.equipment.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { [sortBy as string]: sortOrder as "asc" | "desc" },
      include: {
        maintenanceLogs: {
          orderBy: { performedAt: "desc" },
          take: 1,
        },
      },
    });

    // Calculate statistics
    const stats = await prisma.equipment.groupBy({
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
      }, {} as any),
    });
  } catch (error) {
    console.error("Error getting equipment:", error);
    res.status(500).json({
      isSuccess: false,
      message: "Server error!",
    });
    return;
  }
};

// Get details of specific equipment
export const getSingleEquipment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const equipment = await prisma.equipment.findUnique({
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
  } catch (error) {
    console.error("Error getting equipment:", error);
    res.status(500).json({
      isSuccess: false,
      message: "Server error!",
    });
    return;
  }
};

// Update equipment details
export const updateEquipment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if equipment exists
    const existingEquipment = await prisma.equipment.findUnique({
      where: { id },
    });

    if (!existingEquipment) {
      res.status(404).json({
        isSuccess: false,
        message: "Equipment not found!",
      });
      return;
    }

    // Check serial number uniqueness if being updated
    if (
      updateData.serialNumber &&
      updateData.serialNumber !== existingEquipment.serialNumber
    ) {
      const duplicateSerial = await prisma.equipment.findUnique({
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

    // Update available quantity if total quantity changes
    if (
      updateData.quantity &&
      updateData.quantity !== existingEquipment.quantity
    ) {
      const difference = updateData.quantity - existingEquipment.quantity;
      updateData.available = existingEquipment.available + difference;

      if (updateData.available < 0) {
        updateData.available = 0;
      }
    }

    // Convert date strings to Date objects
    if (updateData.purchaseDate)
      updateData.purchaseDate = new Date(updateData.purchaseDate);
    if (updateData.warrantyExpiry)
      updateData.warrantyExpiry = new Date(updateData.warrantyExpiry);
    if (updateData.lastMaintenance)
      updateData.lastMaintenance = new Date(updateData.lastMaintenance);
    if (updateData.nextMaintenance)
      updateData.nextMaintenance = new Date(updateData.nextMaintenance);

    const updatedEquipment = await prisma.equipment.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      isSuccess: true,
      message: "Equipment updated successfully",
      equipment: updatedEquipment,
    });
    return;
  } catch (error) {
    console.error("Error updating equipment:", error);
    res.status(500).json({
      isSuccess: false,
      message: "Server error!",
    });
    return;
  }
};

// Remove equipment from inventory
export const deleteEquipment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const equipment = await prisma.equipment.findUnique({
      where: { id },
    });

    if (!equipment) {
      res.status(404).json({
        isSuccess: false,
        message: "Equipment not found!",
      });
      return;
    }

    // Check if equipment is currently in use
    if (equipment.inUse > 0) {
      res.status(400).json({
        isSuccess: false,
        message: "Cannot delete equipment that is currently in use!",
      });
      return;
    }

    // Delete maintenance logs first
    await prisma.maintenanceLog.deleteMany({
      where: { equipmentId: id },
    });

    // Delete equipment
    await prisma.equipment.delete({
      where: { id },
    });

    res.status(200).json({
      isSuccess: true,
      message: "Equipment deleted successfully",
    });
    return;
  } catch (error) {
    console.error("Error deleting equipment:", error);
    res.status(500).json({
      isSuccess: false,
      message: "Server error!",
    });
    return;
  }
};

// Update equipment status
export const updateEquipmentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, maintenance, nextMaintenance } = req.body;

    const equipment = await prisma.equipment.findUnique({
      where: { id },
    });

    if (!equipment) {
      res.status(404).json({
        isSuccess: false,
        message: "Equipment not found!",
      });
      return;
    }

    const updateData: any = { status };

    if (maintenance !== undefined) updateData.maintenance = maintenance;
    if (nextMaintenance) updateData.nextMaintenance = new Date(nextMaintenance);

    if (status === "OPERATIONAL") {
      updateData.maintenance = false;
    }

    const updatedEquipment = await prisma.equipment.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      isSuccess: true,
      message: "Equipment status updated successfully",
      equipment: updatedEquipment,
    });
    return;
  } catch (error) {
    console.error("Error updating equipment status:", error);
    res.status(500).json({
      isSuccess: false,
      message: "Server error!",
    });
    return;
  }
};

// Add maintenance log
export const addMaintenanceLog = async (req: Request, res: Response) => {
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

    // Check if equipment exists
    const equipment = await prisma.equipment.findUnique({
      where: { id },
    });

    if (!equipment) {
      res.status(404).json({
        isSuccess: false,
        message: "Equipment not found!",
      });
      return;
    }

    // Create maintenance log
    const maintenanceLog = await prisma.maintenanceLog.create({
      data: {
        equipmentId: id,
        type,
        description,
        cost: cost ? parseFloat(cost) : null,
        performedBy,
        nextDue: nextDue ? new Date(nextDue) : null,
      },
    });

    // Update equipment maintenance info
    await prisma.equipment.update({
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
  } catch (error) {
    console.error("Error adding maintenance log:", error);
    res.status(500).json({
      isSuccess: false,
      message: "Server error!",
    });
    return;
  }
};

// Get equipment statistics
export const getEquipmentStats = async (req: Request, res: Response) => {
  try {
    const totalEquipment = await prisma.equipment.count();
    const operationalEquipment = await prisma.equipment.count({
      where: { status: "OPERATIONAL" },
    });
    const maintenanceEquipment = await prisma.equipment.count({
      where: { status: "MAINTENANCE" },
    });
    const outOfServiceEquipment = await prisma.equipment.count({
      where: { status: "OUT_OF_SERVICE" },
    });

    const categoryStats = await prisma.equipment.groupBy({
      by: ["category"],
      _count: { category: true },
    });

    const totalValue = await prisma.equipment.aggregate({
      _sum: { cost: true },
    });

    // Get maintenance due equipment
    const maintenanceDueEquipment = await prisma.equipment.findMany({
      where: {
        nextMaintenance: {
          lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Next 30 days
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

    // Get recent maintenance logs
    const recentMaintenanceLogs = await prisma.maintenanceLog.findMany({
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
  } catch (error) {
    console.error("Error getting equipment stats:", error);
    res.status(500).json({
      isSuccess: false,
      message: "Server error!",
    });
    return;
  }
};

// Get all maintenance logs
export const getMaintenanceLogs = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, equipmentId, type } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};
    
    if (equipmentId) {
      whereClause.equipmentId = equipmentId as string;
    }
    
    if (type) {
      whereClause.type = type;
    }

    const [maintenanceLogs, total] = await Promise.all([
      prisma.maintenanceLog.findMany({
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
      prisma.maintenanceLog.count({ where: whereClause }),
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
  } catch (error) {
    console.error("Error getting maintenance logs:", error);
    res.status(500).json({
      isSuccess: false,
      message: "Server error!",
    });
    return;
  }
};

// Check out equipment (mark as in use)
export const checkOutEquipment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity = 1 } = req.body;

    const equipment = await prisma.equipment.findUnique({
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

    const updatedEquipment = await prisma.equipment.update({
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
  } catch (error) {
    console.error("Error checking out equipment:", error);
    res.status(500).json({
      isSuccess: false,
      message: "Server error!",
    });
    return;
  }
};

// Check in equipment (mark as available)
export const checkInEquipment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity = 1 } = req.body;

    const equipment = await prisma.equipment.findUnique({
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

    const updatedEquipment = await prisma.equipment.update({
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
  } catch (error) {
    console.error("Error checking in equipment:", error);
    res.status(500).json({
      isSuccess: false,
      message: "Server error!",
    });
    return;
  }
};
