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
const PORT = process.env.PORT;


app.use(express.json());
app.use(cookieParser());
app.use(cors(
    {
        origin: "http://localhost:5173",
    }
));

app.use("/api/users", userRoute);
app.use("/api/members", memberRoute);
app.use("/api/payments", paymentRoute);
app.use("/api/equipments", equipmentRoute);
app.use("/api/subscriptions", subscriptionRoute);
app.use("/api/auth", authRoute);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))