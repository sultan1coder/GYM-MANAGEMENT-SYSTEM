import { Router } from "express";
import { loginUser, logoutUser,  registerUser, whoami } from "../controllers/auth.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, whoami);

export default router;