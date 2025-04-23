import { Router } from "express";
import { deleteMember, getAllMembers, loginMember, registerMember, updateMember, } from "../controllers/members.controller";
import { subscribeMember, unsubscribeMember } from "../controllers/subscription.controller";
import { adminRoute } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/list", getAllMembers);
router.get("/login", loginMember);
router.post("/register",  registerMember);
router.put("/update/:id",  updateMember);
router.delete("/delete/:id",  deleteMember);
router.post("/:id/subscribe",  subscribeMember);
router.post("/:id/unsubscribe",  unsubscribeMember);


export default router;