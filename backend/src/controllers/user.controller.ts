import { Request, Response } from "express";
import { defaultErrorMessage } from "../constants";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ICreateUserPayload {
    name: string;
    email: string;
    password: string;
}

interface IUpdateUser {
    user_id: number;
    name: string;
    email: string;
    password: string;
}

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body as ICreateUserPayload;

        if (!name || !email || !password) {
            res.status(400).json({
                isSuccess: false,
                message: "validation error!"
            })
            return
        }

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password
            }
        });

        res.status(200).json({
            isSuccess: true,
            message: "Successfully created new user",
            user
        })
    } catch (error) {
        res.status(500).json({
            isSuccess: false,
            message: defaultErrorMessage,
            error: JSON.stringify(error)
        });
    }
}


export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findMany();
        res.status(200).json({
            isSuccess: true,
            message: "Successfully fetched all users",
            user
        })
    } catch (error) {
        res.status(500).json({
            isSuccess: false,
            message: defaultErrorMessage
        });
    }
}


export const getSingleUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const user = await prisma.user.findFirst({
            where: {
                id: +userId
            }
        });

        if (!user) {
            res.status(404).json({
                isSuccess: false,
                message: "User not found!"
            });
            return;
        }

        res.status(200).json({
            isSuccess: true,
            user
        })
    } catch (error) {
        console.log("Error: " + error)
        res.status(500).json({
            isSuccess: false,
            message: "Server error!"
        })
    }
    return;
}


export const updateUser = async (req: Request, res: Response) => {
    try {
        const { user_id, name, email, password } = req.body as IUpdateUser;
        const user = await prisma.user.findFirst({
            where: {
                id: user_id,
            }
        })

        if (!user) {
            res.status(404).json({
                isSuccess: false,
                message: "User not found!"
            });
            return;
        }

        const updateUser = await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                name,
                email,
                password
            }
        });

        res.status(200).json({
            isSuccess: true,
            message: "User successfully updated",
            updateUser
        });
    } catch (error) {
        console.log("Error: " + error)
        res.status(500).json({
            isSuccess: false,
            message: "Server error!"
        })
    }
    return;
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const user = await prisma.user.findFirst({
            where: {
                id: +userId
            }
        });

        if (!user) {
            res.status(404).json({
                isSuccess: false,
                msessage: "User not found!"
            });
            return;
        }

        const deleteUser = await prisma.user.delete({
            where: {
                id: user.id
            }
        });

        res.status(200).json({
            isSuccess: true,
            message: "User successfully deleted",
            deleteUser
        })
    } catch (error) {
        console.log("Error: " + error)
        res.status(500).json({
            isSuccess: false,
            message: "Server error!"
        })
    }
    return;
}