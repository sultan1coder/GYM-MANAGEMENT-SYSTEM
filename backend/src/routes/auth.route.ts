import { Router } from "express";
import { loginUser, logoutUser, refreshToken, registerUser, resetPassword, whoami } from "../controllers/auth.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/reset", resetPassword);
router.post("/refresh", refreshToken);
router.get("/me", protect, whoami);

export default router;