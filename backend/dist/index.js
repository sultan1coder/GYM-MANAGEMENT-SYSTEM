"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
const corsOptions = {
    origin: process.env.NODE_ENV === "production"
        ? [
            process.env.CORS_ORIGIN ||
                "https://gym-management-frontend.onrender.com",
        ]
        : ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
};
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOptions));
app.get("/api/health", (_req, res) => {
    res.status(200).json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
        uptime: process.uptime(),
    });
});
app.get("/api", (_req, res) => {
    res.json({
        message: "Gym Management System API",
        version: "1.0.0",
        status: "running",
    });
});
app.get("/api/auth", (_req, res) => {
    res.json({ message: "Auth endpoints will be implemented here" });
});
app.get("/api/users", (_req, res) => {
    res.json({ message: "User management endpoints will be implemented here" });
});
app.get("/api/members", (_req, res) => {
    res.json({ message: "Member management endpoints will be implemented here" });
});
app.get("/api/payments", (_req, res) => {
    res.json({ message: "Payment management endpoints will be implemented here" });
});
app.get("/api/equipments", (_req, res) => {
    res.json({ message: "Equipment management endpoints will be implemented here" });
});
app.get("/api/subscriptions", (_req, res) => {
    res.json({ message: "Subscription management endpoints will be implemented here" });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`Health check available at: /api/health`);
});
//# sourceMappingURL=index.js.map