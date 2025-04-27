import { Router } from "express";
import { deleteMember, getAllMembers, getSingleMember, loginMember, registerMember, updateMember, } from "../controllers/members.controller";
import { subscribeMember, unsubscribeMember } from "../controllers/subscription.controller";

const router = Router();

router.get("/list", getAllMembers);
router.post("/login", loginMember);
router.post("/register",  registerMember);
router.get("/single/:id", getSingleMember);
router.put("/update/:id",  updateMember);
router.delete("/delete/:id",  deleteMember);
router.post("/:id/subscribe",  subscribeMember);
router.post("/:id/unsubscribe",  unsubscribeMember);


export default router;