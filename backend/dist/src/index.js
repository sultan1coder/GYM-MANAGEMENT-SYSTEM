"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const members_route_1 = __importDefault(require("./routes/members.route"));
const payment_route_1 = __importDefault(require("./routes/payment.route"));
const equipment_route_1 = __importDefault(require("./routes/equipment.route"));
const subscription_route_1 = __importDefault(require("./routes/subscription.route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
};
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOptions));
app.use('/uploads', express_1.default.static('uploads'));
app.get("/api", (_req, res) => {
    res.json({
        message: "Gym Management System API",
        version: "1.0.0",
        status: "running",
    });
});
app.use("/api/auth", auth_route_1.default);
app.use("/api/users", user_route_1.default);
app.use("/api/members", members_route_1.default);
app.use("/api/payments", payment_route_1.default);
app.use("/api/equipments", equipment_route_1.default);
app.use("/api/subscriptions", subscription_route_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map