"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.whoami = exports.resetPassword = exports.forgotPassword = exports.refreshToken = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../utils/auth");
const crypto_1 = __importDefault(require("crypto"));
const registerUser = async (req, res) => {
    try {
        const { name, username, email, password, confirmPassword, phone_number, role, } = req.body;
        if (password !== confirmPassword) {
            res.status(400).json({
                isSuccess: false,
                message: "Password must match",
            });
            return;
        }
        const existingUser = await prisma_1.default.user.findUnique({
            where: {
                email: email,
            },
        });
        if (existingUser) {
            res.status(400).json({
                message: "User already exists!",
            });
            return;
        }
        const hashedPassword = await (0, auth_1.hashPassword)(password);
        const newUser = await prisma_1.default.user.create({
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
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma_1.default.user.findUnique({
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
        const isMatch = await (0, auth_1.comparePassword)(password, user.password);
        if (!isMatch) {
            res.status(400).json({
                message: "Incorrect email or password",
            });
            return;
        }
        const { accessToken, refreshToken } = (0, auth_1.generateTokenPair)(String(user.id), user.role, user.tokenVersion);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            isSuccess: true,
            user,
            accessToken,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        });
    }
};
exports.loginUser = loginUser;
const logoutUser = async (req, res) => {
    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        if (req.user) {
            await prisma_1.default.user.update({
                where: { id: Number(req.user.id) },
                data: { tokenVersion: { increment: 1 } },
            });
        }
        res.status(201).json({
            message: "Logged out successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        });
    }
};
exports.logoutUser = logoutUser;
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            res.status(401).json({
                message: "Refresh token required",
            });
            return;
        }
        const decoded = (0, auth_1.verifyRefreshToken)(refreshToken);
        if (!decoded) {
            res.status(401).json({
                message: "Invalid refresh token",
            });
            return;
        }
        const user = await prisma_1.default.user.findUnique({
            where: { id: Number(decoded.id) },
        });
        if (!user || user.tokenVersion !== decoded.tokenVersion) {
            res.status(401).json({
                message: "Invalid refresh token",
            });
            return;
        }
        const { accessToken, refreshToken: newRefreshToken } = (0, auth_1.generateTokenPair)(String(user.id), user.role, user.tokenVersion);
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
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
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        });
    }
};
exports.refreshToken = refreshToken;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ message: "Email is required" });
            return;
        }
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user) {
            res
                .status(200)
                .json({ message: "If an account exists, a reset link has been sent" });
            return;
        }
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        const resetTokenExp = new Date(Date.now() + 60 * 60 * 1000);
        await prisma_1.default.user.update({
            where: { id: user.id },
            data: { resetToken, resetTokenExp },
        });
        res.status(200).json({
            isSuccess: true,
            message: "Password reset link generated",
            resetToken,
            expiresAt: resetTokenExp,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword, confirmPassword } = req.body;
        if (!token || !newPassword || !confirmPassword) {
            res.status(400).json({ message: "Token and passwords are required" });
            return;
        }
        if (newPassword !== confirmPassword) {
            res.status(400).json({ message: "Password must match" });
            return;
        }
        const user = await prisma_1.default.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExp: { gt: new Date() },
            },
        });
        if (!user) {
            res.status(400).json({ message: "Invalid or expired token" });
            return;
        }
        const hashedPassword = await (0, auth_1.hashPassword)(newPassword);
        await prisma_1.default.user.update({
            where: { id: user.id },
            data: { password: hashedPassword, resetToken: null, resetTokenExp: null },
        });
        res.status(200).json({ message: "Password reset successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};
exports.resetPassword = resetPassword;
const whoami = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ isSuccess: false, message: "Unauthorized" });
            return;
        }
        const userId = req.user.id;
        const user = await prisma_1.default.user.findUnique({
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
    }
    catch (error) {
        console.log("Error: " + error);
        res.status(500).json({
            isSuccess: false,
            message: "Server error!",
        });
    }
};
exports.whoami = whoami;
//# sourceMappingURL=auth.controller.js.map