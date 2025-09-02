import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import GymWebSocketServer from "./websocket/websocket";

// Import routes
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import memberRoutes from "./routes/members.route";
import paymentRoutes from "./routes/payment.route";
import equipmentRoutes from "./routes/equipment.route";
import subscriptionRoutes from "./routes/subscription.route";
import attendanceRoutes from "./routes/attendance.route";
import fitnessRoutes from "./routes/fitness.route";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// CORS configuration
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));

// Serve static files from uploads directory
app.use("/uploads", express.static("uploads"));

// Basic API endpoint
app.get("/api", (_req, res) => {
  res.json({
    message: "Gym Management System API",
    version: "1.0.0",
    status: "running",
  });
});

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/equipments", equipmentRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/fitness", fitnessRoutes);

// Create HTTP server
const server = createServer(app);

// Initialize WebSocket server
const websocketServer = new GymWebSocketServer(server, 4001);

// Start the server
server.listen(PORT, () => {
  console.log(`🚀 HTTP Server is running on port ${PORT}`);
  console.log(`🔗 WebSocket Server is running on port 4001`);
  console.log(`🌐 API available at: http://localhost:${PORT}/api`);
  console.log(`📡 WebSocket available at: ws://localhost:4001`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Shutting down servers...");
  websocketServer.close();
  server.close(() => {
    console.log("✅ Servers shut down gracefully");
    process.exit(0);
  });
});
