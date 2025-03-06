import { Router } from "express";
import { createMember, deleteMember, getAllMembers, getSingleMember, updateMember, } from "../controllers/members.controller";
import { subscribeMember, unsubscribeMember } from "../controllers/subscription.controller";
import { adminRoute } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/list", getAllMembers);
router.get("/single/:id", getSingleMember);
router.post("/create", adminRoute, createMember);
router.put("/update/:id", adminRoute, updateMember);
router.delete("/delete/:id", adminRoute, deleteMember);
router.post("/:id/subscribe", adminRoute, subscribeMember);
router.post("/:id/unsubscribe", adminRoute, unsubscribeMember);


export default router;