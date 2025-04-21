import { Request, Response } from "express";
import { defaultErrorMessage } from "../constants";
import { MemberShipType, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


interface ICreateMembersPayload {
    name: string,
    email: string,
    phone_number: string,
    password: string,
    confirmPasword: string,
    age: number,
    membershiptype: MemberShipType,
}

interface IUpdateMember {
    member_id: string,
    name: string,
    email: string,
    age: number,
    membershiptype: MemberShipType,
}

export const getAllMembers = async (req: Request, res: Response) => {
    try {
        const members = await prisma.member.findMany();
        res.status(200).json({
            message: "Successfully fetched all members",
            members
        })
    } catch (error) {
        res.status(500).json({
            isSuccess: false,
            message: defaultErrorMessage
        });
    }
}


export const getSingleMember = async (req: Request, res: Response) => {
    try {
        const memberId = req.params.id;
        const member = await prisma.member.findFirst({
            where: {
                id: memberId,
            }
        });

        if (!member) {
            res.status(404).json({
                isSuccess: false,
                message: "Member is not found!"
            })
            return;
        }

        res.status(200).json({
            isSuccess: true,
            message: "Successfully fetched a member",
            member
        })
        return;
    } catch (error) {
        res.status(500).json({
            isSuccess: false,
            message: defaultErrorMessage,
            error: JSON.stringify(error)
        });
    }
    return;
}


export const createMember = async (req: Request, res: Response) => {
    try {
        const { name, email, age, phone_number, password, confirmPasword, membershiptype } = req.body as ICreateMembersPayload;

        if (!name || !email || !age || phone_number||password||confirmPasword ||!membershiptype) {
            res.status(400).json({
                isSuccess: false,
                message: "Validation error"
            });
            return;
        }
        const newMember = await prisma.member.create({
            data: {
                name,
                email,
                age,
                phone_number,
                password,
                confirmPasword,
                membershiptype,
            }
        });

        res.status(200).json({
            isSuccess: true,
            message: "Member successfully created",
            newMember
        });
        return;
    } catch (error) {
        console.log("Error: " + error)
        res.status(500).json({
            isSuccess: false,
            message: "Server error!"
        });
    }
}


export const updateMember = async (req: Request, res: Response) => {
    try {
        const { member_id, name, email, age, membershiptype } = req.body as IUpdateMember;
        const member = await prisma.member.findFirst({
            where: {
                id: member_id,
            }
        });

        if (!member) {
            res.status(404).json({
                isSuccess: false,
                message: "Member not found!"
            });
            return;
        }

        const updateMember = await prisma.member.update({
            where: {
                id: member.id,
            },
            data: {
                name,
                email,
                age,
                membershiptype
            }
        });

        res.status(200).json({
            isSuccess: true,
            message: "Member successfully updated",
            updateMember
        });
    } catch (error) {
        console.log("Error: " + error)
        res.status(500).json({
            isSuccess: false,
            message: "Server error!"
        });
    }
    return;
}


export const deleteMember = async (req: Request, res: Response) => {
    try {
        const memberId = req.params.id;
        const member = await prisma.member.findFirst({
            where: {
                id: memberId
            }
        });

        if (!member) {
            res.status(404).json({
                isSuccess: false,
                message: "Member not found!"
            });

            return;
        }

        const deleteMember = await prisma.member.delete({
            where: {
                id: member.id
            }
        });

        res.status(200).json({
            isSuccess: true,
            message: "Member successfully deleted!",
            deleteMember
        });
    } catch (error) {
        console.log("Error: " + error)
        res.status(500).json({
            isSuccess: false,
            message: "Server error!"
        })
    }
}