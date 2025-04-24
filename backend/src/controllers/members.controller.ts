import { Request, Response } from "express";
import { defaultErrorMessage } from "../constants";
import { MemberShipType, PrismaClient } from "@prisma/client";
import { comparePassword, generateToken, hashPassword } from "../utils/auth";

const prisma = new PrismaClient();


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
    const {
      name,
      email,
      password,
      confirmPassword,
      phone_number,
      age,
      membershiptype,
    } = req.body;

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      res.status(400).json({
        isSuccess: false,
        message: "Password must match",
      });
      return;
    }
    const existingMember = await prisma.member.findUnique({
      where: {
        email: email,
      },
    });

    // CHECK IF THE USER IS EXISTING
    if (existingMember) {
      res.status(400).json({
        message: "Member already exists!",
      });
      return;
    }

    // HASH THE PASSWORD
    const hashedPassword = await hashPassword(password);

    // CREATE THE USER
    const newMember = await prisma.member.create({
      data: {
        name,
        email,
        phone_number,
        age,
        membershiptype,
        password: hashedPassword,
        confirmPassword: hashedPassword,
      },
    });

    res.status(201).json({
      isSuccess: true,
      message: "User registered successfully",
      newMember,
    });
  } catch (error) {
    res.status(500).json({
      messaga: "Something went wrong",
    });
  }
};

//Login Member
export const loginMember = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const member = await prisma.member.findUnique({
      where: {
        email: email,
      },
    });

    if (!member) {
      res.status(401).json({
        message: "incorrect email or password",
      });
      return;
    }

    const isMatch = await comparePassword(password, member.password);

    if (!isMatch) {
      res.status(400).json({
        message: "Incorrect email or password",
      });
      return;
    }
    // Generate token
    const token = generateToken(member.age);
    res.status(200).json({
      isSuccess: true,
      member,
      token,
    });
  } catch (error) {
    res.status(500).json({
      messaga: "Something went wrong",
    });
  }
};

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
