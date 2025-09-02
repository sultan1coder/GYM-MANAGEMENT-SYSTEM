import { Router } from "express";
import {
  getMemberFitnessGoals,
  createFitnessGoal,
  updateFitnessGoalProgress,
  deleteFitnessGoal,
  getFitnessGoalStats,
} from "../controllers/fitness.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

// Fitness goal routes
router.get("/goals/:memberId", protect, getMemberFitnessGoals);
router.post("/goals/:memberId", protect, createFitnessGoal);
router.put("/goals/progress/:goalId", protect, updateFitnessGoalProgress);
router.delete("/goals/:goalId", protect, deleteFitnessGoal);
router.get("/goals/stats/:memberId", protect, getFitnessGoalStats);

export default router;
