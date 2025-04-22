import { Router } from "express";
import { deleteMember, getAllMembers, getSingleMember, registerMember, updateMember, } from "../controllers/members.controller";
import { subscribeMember, unsubscribeMember } from "../controllers/subscription.controller";
import { adminRoute } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/list", getAllMembers);
router.get("/single/:id", getSingleMember);
router.post("/create",  registerMember);
router.put("/update/:id",  updateMember);
router.delete("/delete/:id",  deleteMember);
router.post("/:id/subscribe",  subscribeMember);
router.post("/:id/unsubscribe",  unsubscribeMember);


export default router;