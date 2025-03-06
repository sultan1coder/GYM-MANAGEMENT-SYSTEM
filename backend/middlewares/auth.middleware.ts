import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/request";
import dotenv from "dotenv";

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "accesssecretkey";

interface DecodedToken {
    userId: number;
    role: string;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        res.status(401).json({
            message: "Not authorized, Token missing",
        });
        return;
    }
    console.log("Received Token:", token);

    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as DecodedToken;
        console.log("Decoded Token:", decoded);

        req.userId = decoded.userId;

        next();
    } catch (error) {
        console.log("JWT Error:", error);

        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                message: "Token expired"
            });
            return;
        }

        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                message: "Invalid token"
            });
            return;
        }

        console.log("Error: " + error)
        res.status(500).json({
            isSuccess: false,
            message: "Server error!"
        });
    }
}


export const adminRoute = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({
            message: "Access denied- Admin only"
        })
    }
}
