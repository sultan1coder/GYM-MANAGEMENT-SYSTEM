import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/request";
export declare const protect: (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const adminRoute: (req: AuthRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map