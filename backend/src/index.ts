import express from "express";
import dotenv from "dotenv";
import userRoute from "./routes/user.route";
import memberRoute from "./routes/members.route";
import paymentRoute from "./routes/payment.route";
import subscriptionRoute from "./routes/subscription.route";
import authRoute from "./routes/auth.route";
import equipmentRoute from "./routes/equipment.route";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT;


app.use(express.json());
app.use(cookieParser());

app.use("/users", userRoute);
app.use("/members", memberRoute);
app.use("/payments", paymentRoute);
app.use("/equipments", equipmentRoute);
app.use("/subscriptions", subscriptionRoute);
app.use("/auth", authRoute);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))