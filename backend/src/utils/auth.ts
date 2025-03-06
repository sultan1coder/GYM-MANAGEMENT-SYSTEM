import jwt from "jsonwebtoken";
import bcyrptp from "bcryptjs";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "accesssecretkey";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refreshsecretkey";

export const hashPassword = async (password: string) => {
    const salt = await bcyrptp.genSalt(10);
    return bcyrptp.hash(password, salt);
}


export const comparePassword = async (password: string, hash: string) => {
    return bcyrptp.compare(password, hash);
}


export const generateAccessToken = (userId: number) => {
    return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}


export const generateRefreshAccessToken = (userId: number) => {
    return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}