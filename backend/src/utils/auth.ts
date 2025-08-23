import jwt from "jsonwebtoken";
import bcyrptp from "bcryptjs";

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "accesssecretkey";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "refreshsecretkey";

export const hashPassword = async (password: string) => {
  const salt = await bcyrptp.genSalt(10);
  return bcyrptp.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string) => {
  return bcyrptp.compare(password, hash);
};

export interface AccessTokenPayload {
  id: string;
  role: string;
}

export interface RefreshTokenPayload {
  id: string;
  tokenVersion: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export const generateToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (payload: RefreshTokenPayload): string => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string): AccessTokenPayload | null => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as AccessTokenPayload;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload | null => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
  } catch (error) {
    return null;
  }
};

export const generateTokenPair = (userId: string, role: string, tokenVersion: number): TokenPair => {
  const accessToken = generateToken({ id: userId, role });
  const refreshToken = generateRefreshToken({ id: userId, tokenVersion });
  
  return { accessToken, refreshToken };
};
