import { Router } from "express";
import { logoutUser, whoami } from "../controllers/auth.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/logout", logoutUser);
router.get("/me", whoami);

export default router;