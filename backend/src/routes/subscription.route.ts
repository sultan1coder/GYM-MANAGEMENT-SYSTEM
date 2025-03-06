import { Router } from "express";
import { createPlan, deletePlan, getAllPlans, getSinglePlan, subscribeMember, updatePlan } from "../controllers/subscription.controller";

const router = Router();

router.get("/list", getAllPlans);
router.get("/single/:id", getSinglePlan);
router.post("/create", createPlan);
router.put("/update/:id", updatePlan);
router.delete("/delete/:id", deletePlan);

export default router;