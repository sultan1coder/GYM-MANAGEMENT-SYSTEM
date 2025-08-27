import express from "express";
import dotenv from "dotenv";
import userRoute from "./routes/user.route";
import memberRoute from "./routes/members.route";
import paymentRoute from "./routes/payment.route";
import subscriptionRoute from "./routes/subscription.route";
import authRoute from "./routes/auth.route";
import equipmentRoute from "./routes/equipment.route";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// CORS configuration for production
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? [
          process.env.CORS_ORIGIN ||
            "https://gym-management-frontend.onrender.com",
        ]
      : ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Health check endpoint for Render
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    uptime: process.uptime(),
  });
});

// API routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/members", memberRoute);
app.use("/api/payments", paymentRoute);
app.use("/api/equipments", equipmentRoute);
app.use("/api/subscriptions", subscriptionRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Health check available at: /api/health`);
});
