import { Request, Response } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { AuthRequest } from "../../types/request";
import prisma from "../lib/prisma";
import { comparePassword, generateTokenPair, verifyRefreshToken, hashPassword } from "../utils/auth";
import crypto from "crypto";

// const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refreshsecretkey";

//Register User
export const registerUser = async (req: Request, res: Response) => {
  try {
    const {
      name,
      username,
      email,
      password,
      confirmPassword,
      phone_number,
      role,
    } = req.body;

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      res.status(400).json({
        isSuccess: false,
        message: "Password must match",
      });
      return;
    }
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    // CHECK IF THE USER IS EXISTING
    if (existingUser) {
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
        username,
        email,
        password: hashedPassword,
        phone_number,
        role: "staff",
      },
    });

    res.status(201).json({
      isSuccess: true,
      message: "User registered successfully",
      newUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

//Login User
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      res.status(401).json({
        message: "incorrect email or password",
      });
      return;
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      res.status(400).json({
        message: "Incorrect email or password",
      });
      return;
    }

    // Generate both access and refresh tokens
    const { accessToken, refreshToken } = generateTokenPair(
      String(user.id), 
      user.role, 
      user.tokenVersion
    );

    // Set refresh token as HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      isSuccess: true,
      user,
      accessToken,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

//Logout User
export const logoutUser = async (req: AuthRequest, res: Response) => {
  try {
    // Clear refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Increment token version to invalidate all existing refresh tokens
    if (req.user) {
      await prisma.user.update({
        where: { id: Number(req.user.id) },
        data: { tokenVersion: { increment: 1 } },
      });
    }

    res.status(201).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// Refresh Token
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      res.status(401).json({
        message: "Refresh token required",
      });
      return;
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      res.status(401).json({
        message: "Invalid refresh token",
      });
      return;
    }

    // Get user and check token version
    const user = await prisma.user.findUnique({
      where: { id: Number(decoded.id) },
    });

    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      res.status(401).json({
        message: "Invalid refresh token",
      });
      return;
    }

    // Generate new token pair
    const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(
      String(user.id),
      user.role,
      user.tokenVersion
    );

    // Set new refresh token cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      isSuccess: true,
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

//Forgot Password - generate a reset token and store short-lived
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body as { email: string };
    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Do not reveal if user exists
      res
        .status(200)
        .json({ message: "If an account exists, a reset link has been sent" });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExp = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExp },
    });

    // In a real app, email the link containing this token
    // For now, return token so frontend can show or use during dev
    res.status(200).json({
      isSuccess: true,
      message: "Password reset link generated",
      resetToken,
      expiresAt: resetTokenExp,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Reset Password - verify token and update password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword, confirmPassword } = req.body as {
      token: string;
      newPassword: string;
      confirmPassword: string;
    };

    if (!token || !newPassword || !confirmPassword) {
      res.status(400).json({ message: "Token and passwords are required" });
      return;
    }
    if (newPassword !== confirmPassword) {
      res.status(400).json({ message: "Password must match" });
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExp: { gt: new Date() },
      },
    });

    if (!user) {
      res.status(400).json({ message: "Invalid or expired token" });
      return;
    }

    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, resetToken: null, resetTokenExp: null },
    });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

//Get Current User
export const whoami = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ isSuccess: false, message: "Unauthorized" });
      return;
    }
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      res.status(404).json({
        isSuccess: false,
        message: "User not found!",
      });
      return;
    }
    res.status(200).json({
      isSuccess: true,
      user,
    });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({
      isSuccess: false,
      message: "Server error!",
    });
  }
};
