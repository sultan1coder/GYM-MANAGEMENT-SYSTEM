import { Request } from "express";

export interface AuthenticatedUser {
  id: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}
