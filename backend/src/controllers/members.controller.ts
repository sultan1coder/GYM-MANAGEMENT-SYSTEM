import { Request, Response } from "express";
import { defaultErrorMessage } from "../constants";
import { MemberShipType } from "@prisma/client";
import prisma from "../lib/prisma";
import { comparePassword, generateToken, hashPassword } from "../utils/auth";

interface IUpdateMember {
  member_id: string;
  name: string;
  email: string;
  phone_number: string;
  age: number;
  membershiptype: MemberShipType;
}

export const getAllMembers = async (req: Request, res: Response) => {
  try {
    const members = await prisma.member.findMany();
    res.status(200).json({
      isSuccess: true,
      message: "Successfully fetched all members",
      data: members,
    });
  } catch (error) {
    console.log(error);
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
      data: member,
    });
  } catch (error) {
    console.error("Get single member error:", error);
    res.status(500).json({
      isSuccess: false,
      message: defaultErrorMessage,
    });
  }
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
      },
    });

    res.status(201).json({
      isSuccess: true,
      message: "Member registered successfully",
      newMember,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      console: { error },
    });
  }
};

//Login Member
export const loginMember = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      res.status(400).json({
        isSuccess: false,
        message: "Email and password are required",
      });
      return;
    }

    const member = await prisma.member.findUnique({
      where: {
        email: email,
      },
    });

    if (!member) {
      res.status(401).json({
        isSuccess: false,
        message: "Incorrect email or password",
      });
      return;
    }

    const isMatch = await comparePassword(password, member.password);

    if (!isMatch) {
      res.status(401).json({
        isSuccess: false,
        message: "Incorrect email or password",
      });
      return;
    }

    // Generate token
    const token = generateToken({ id: member.id, role: "member" });
    
    res.status(200).json({
      isSuccess: true,
      message: "Login successful",
      member,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      isSuccess: false,
      message: "Something went wrong during login",
    });
  }
};

export const updateMember = async (req: Request, res: Response) => {
  try {
    const memberId = req.params.id;
    const { name, email, phone_number, age, membershiptype } = req.body as Omit<
      IUpdateMember,
      "member_id"
    >;
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

    const updateMember = await prisma.member.update({
      where: {
        id: member.id,
      },
      data: {
        name,
        email,
        phone_number,
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

export const updateMemberProfilePicture = async (req: Request, res: Response) => {
  try {
    const memberId = req.params.id;
    const { profile_picture } = req.body;

    if (!profile_picture) {
      res.status(400).json({
        isSuccess: false,
        message: "Profile picture URL is required!",
      });
      return;
    }

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

    const updatedMember = await prisma.member.update({
      where: {
        id: member.id,
      },
      data: {
        profile_picture,
      },
    });

    res.status(200).json({
      isSuccess: true,
      message: "Profile picture successfully updated",
      member: updatedMember,
    });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({
      isSuccess: false,
      message: "Server error!",
    });
  }
};
