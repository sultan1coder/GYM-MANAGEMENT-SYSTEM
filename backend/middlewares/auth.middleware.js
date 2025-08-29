"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoute = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("../src/utils/auth");
dotenv_1.default.config();
const protect = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        res.status(401).json({
            message: "Not authorized, Token missing",
        });
        return;
    }
    try {
        const decoded = (0, auth_1.verifyAccessToken)(token);
        if (!decoded) {
            res.status(401).json({
                message: "Invalid token",
            });
            return;
        }
        req.user = { id: decoded.id, role: decoded.role };
        next();
    }
    catch (error) {
        console.log("JWT Error:", error);
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({
                message: "Token expired",
                code: "TOKEN_EXPIRED",
            });
            return;
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
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
exports.protect = protect;
const adminRoute = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    }
    else {
        res.status(403).json({
            message: "Access denied- Admin only",
        });
    }
};
exports.adminRoute = adminRoute;
//# sourceMappingURL=auth.middleware.js.map