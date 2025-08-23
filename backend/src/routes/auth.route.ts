import { Router } from "express";
import {
  logoutUser,
  whoami,
  loginUser,
  registerUser,
  forgotPassword,
  resetPassword,
  refreshToken,
} from "../controllers/auth.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/refresh", refreshToken);
router.post("/logout", protect, logoutUser);
router.get("/me", protect, whoami);

export default router;
