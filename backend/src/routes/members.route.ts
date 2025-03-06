import { Router } from "express";
import { createMember, deleteMember, getAllMembers, getSingleMember, updateMember, } from "../controllers/members.controller";
import { subscribeMember, unsubscribeMember } from "../controllers/subscription.controller";

const router = Router();

router.get("/list", getAllMembers);
router.get("/single/:id", getSingleMember);
router.post("/create", createMember);
router.put("/update/:id", updateMember);
router.delete("/delete/:id", deleteMember);
router.post("/:id/subscribe", subscribeMember);
router.post("/:id/unsubscribe", unsubscribeMember);


export default router;