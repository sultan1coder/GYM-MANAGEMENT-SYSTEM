import express from "express";
import dotenv from "dotenv";
import cors from "cors";

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



// Basic API endpoint
app.get("/api", (_req, res) => {
  res.json({
    message: "Gym Management System API",
    version: "1.0.0",
    status: "running",
  });
});

// Placeholder endpoints for future implementation
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
});
