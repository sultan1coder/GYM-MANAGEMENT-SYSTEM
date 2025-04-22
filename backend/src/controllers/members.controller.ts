import { Request, Response } from "express";
import { defaultErrorMessage } from "../constants";
import { MemberShipType, PrismaClient } from "@prisma/client";
import { hashPassword } from "../utils/auth";

const prisma = new PrismaClient();

interface ICreateMembersPayload {
  name: string;
  email: string;
  phone_number: string;
  password: string;
  confirmPassword: string;
  age: number;
  membershiptype: MemberShipType;
}

interface IUpdateMember {
  member_id: string;
  name: string;
  email: string;
  age: number;
  membershiptype: MemberShipType;
}

export const getAllMembers = async (req: Request, res: Response) => {
  try {
    const members = await prisma.member.findMany();
    res.status(200).json({
      message: "Successfully fetched all members",
      members,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: defaultErrorMessage,
    });
  }
};

export const getSingleMember = async (req: Request, res: Response) => {
  try {
    const memberId = req.params.id;
    const member = await prisma.member.findFirst({
      where: {
        id: memberId,
      },
    });

    if (!member) {
      res.status(404).json({
        isSuccess: false,
        message: "Member is not found!",
      });
      return;
    }

    res.status(200).json({
      isSuccess: true,
      message: "Successfully fetched a member",
      member,
    });
    return;
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: defaultErrorMessage,
      error: JSON.stringify(error),
    });
  }
  return;
};


//Register Member
export const registerMember = async (req: Request, res: Response) => {
    try {
        const { name, email, password, confirmPassword, phone_number} = req.body;

        // Check if password and confirm password match
        if (password !== confirmPassword) {
            res.status(400).json({
                isSuccess: false,
                message: "Password must match"
            });
            return;
        }
        const existingMember = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        // CHECK IF THE USER IS EXISTING
        if (existingMember) {
            res.status(400).json({
                message: "User already exists!",
            });
            return;
        }

        // HASH THE PASSWORD
        const hashedPassword = await hashPassword(password);

        // CREATE THE USER
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                phone_number,
                password: hashedPassword,
                confirmPassword: hashedPassword,
            }
        });

        res.status(201).json({
            isSuccess: true,
            message: "User registered successfully",
            newUser
        });
    } catch (error) {
        res.status(500).json({
            messaga: "Something went wrong"
        });
    }
}
export const updateMember = async (req: Request, res: Response) => {
  try {
    const { member_id, name, email, age, membershiptype } =
      req.body as IUpdateMember;
    const member = await prisma.member.findFirst({
      where: {
        id: member_id,
      },
    });

    if (!member) {
      res.status(404).json({
        isSuccess: false,
        message: "Member not found!",
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
        membershiptype,
      },
    });

    res.status(200).json({
      isSuccess: true,
      message: "Member successfully updated",
      updateMember,
    });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({
      isSuccess: false,
      message: "Server error!",
    });
  }
  return;
};

export const deleteMember = async (req: Request, res: Response) => {
  try {
    const memberId = req.params.id;
    const member = await prisma.member.findFirst({
      where: {
        id: memberId,
      },
    });

    if (!member) {
      res.status(404).json({
        isSuccess: false,
        message: "Member not found!",
      });

      return;
    }

    const deleteMember = await prisma.member.delete({
      where: {
        id: member.id,
      },
    });

    res.status(200).json({
      isSuccess: true,
      message: "Member successfully deleted!",
      deleteMember,
    });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({
      isSuccess: false,
      message: "Server error!",
    });
  }
};
