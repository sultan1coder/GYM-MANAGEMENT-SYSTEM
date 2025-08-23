import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/request";
import dotenv from "dotenv";
import { verifyAccessToken } from "../src/utils/auth";

dotenv.config();

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({
      message: "Not authorized, Token missing",
    });
    return;
  }

  try {
    const decoded = verifyAccessToken(token);
    
    if (!decoded) {
      res.status(401).json({
        message: "Invalid token",
      });
      return;
    }

    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    console.log("JWT Error:", error);

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        message: "Token expired",
        code: "TOKEN_EXPIRED",
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        message: "Invalid token",
      });
      return;
    }

    console.log("Error: " + error);
    res.status(500).json({
      isSuccess: false,
      message: "Server error!",
    });
  }
};

export const adminRoute = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      message: "Access denied- Admin only",
    });
  }
};
