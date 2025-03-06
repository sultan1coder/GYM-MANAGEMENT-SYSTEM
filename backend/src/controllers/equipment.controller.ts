import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


//Add new equipment
export const addEquipment = async (req: Request, res: Response) => {
    try {
        const { name, type, quantity } = req.body;

        if (!name || !type || !quantity) {
            res.status(400).json({
                isSuccess: false,
                message: "Validation error!"
            });
            return;
        }
        const equipment = await prisma.equipment.create({
            data: {
                name,
                type,
                quantity,
            }
        });

        res.status(200).json({
            isSuccess: true,
            message: "Equipment successfully added",
            equipment
        });
    } catch (error) {
        console.log("Error: " + error)
        res.status(500).json({
            isSuccess: false,
            message: "Server error!"
        });
    }
}


// List all equipment
export const getAllEquipment = async (req: Request, res: Response) => {
    try {
        const equipment = await prisma.equipment.findMany();
        res.status(200).json({
            message: "Successfully listed all equipments",
            equipment
        })
    } catch (error) {
        console.log("Error: " + error)
        res.status(500).json({
            isSuccess: false,
            message: "Server error!"
        });
    }
}


// Get details of specific equipment
export const getSingleEquipment = async (req: Request, res: Response) => {
    try {
        const equipmentId = req.params.id;
        const equipment = await prisma.equipment.findFirst({
            where: {
                id: equipmentId,
            }
        });

        if (!equipment) {
            res.status(404).json({
                message: "Equipment not found!"
            });
            return;
        }

        res.status(200).json({
            message: "Successfully fetched a equipment",
            equipment
        });
    } catch (error) {
        console.log("Error: " + error)
        res.status(500).json({
            isSuccess: false,
            message: "Server error!"
        });
    }
}


// Update equipment details
export const updateEquipment = async (req: Request, res: Response) => {
    try {
        const equipmentId = req.params.id;
        const { name, type, quantity } = req.body;

        if (!name || !type || !quantity) {
            res.status(400).json({
                message: "Validation error"
            });
            return;
        }

        const equipment = await prisma.equipment.findFirst({
            where: {
                id: equipmentId,
            }
        });
        if (!equipment) {
            res.status(404).json({
                message: "Equipment not found!"
            });
            return;
        }

        const updateEquipment = await prisma.equipment.update({
            where: {
                id: equipment.id,
            },
            data: {
                name,
                type,
                quantity,
            }
        });

        res.status(200).json({
            isSuccess: true,
            message: "Successfully updated a equipment",
            updateEquipment
        });
    } catch (error) {
        console.log("Error: " + error)
        res.status(500).json({
            isSuccess: false,
            message: "Server error!"
        });
    }
}


// Remove equipment from inventory
export const deleteEquipment = async (req: Request, res: Response) => {
    try {
        const equipmentId = req.params.id;
        const equipment = await prisma.equipment.findFirst({
            where: {
                id: equipmentId
            }
        });

        if (!equipment) {
            res.status(404).json({
                message: "Equipment not found!"
            });
            return;
        }

        const deleteEquipment = await prisma.equipment.delete({
            where: {
                id: equipment.id
            }
        });

        res.status(200).json({
            message: "Successfully deleted equipment",
            deleteEquipment
        });
    } catch (error) {
        console.log("Error: " + error)
        res.status(500).json({
            isSuccess: false,
            message: "Server error!"
        });
    }
}