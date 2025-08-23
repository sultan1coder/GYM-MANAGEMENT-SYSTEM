import { Router } from "express";
import {
  createPlan,
  deletePlan,
  getAllPlans,
  getSinglePlan,
  subscribeMember,
  updatePlan,
} from "../controllers/subscription.controller";
import { protect, adminRoute } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/list", protect, getAllPlans);
router.get("/single/:id", protect, getSinglePlan);
router.post("/create", protect, adminRoute, createPlan);
router.put("/update/:id", protect, adminRoute, updatePlan);
router.delete("/delete/:id", protect, adminRoute, deletePlan);

export default router;
