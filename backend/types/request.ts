import { Request } from "express";  

interface AuthenticatedUser {
    id: string;
    role: string;
}

export interface AuthRequest extends Request {
    userId? : number;
    user? : AuthenticatedUser;
}