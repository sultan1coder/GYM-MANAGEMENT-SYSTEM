import { Router } from "express";
import {
  deleteMember,
  getAllMembers,
  getSingleMember,
  loginMember,
  registerMember,
  updateMember,
  updateMemberProfilePicture,
} from "../controllers/members.controller";
import {
  subscribeMember,
  unsubscribeMember,
} from "../controllers/subscription.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/list", protect, getAllMembers);
router.post("/login", loginMember);
router.post("/register", registerMember);
router.get("/single/:id", protect, getSingleMember);
router.put("/update/:id", protect, updateMember);
router.put("/profile-picture/:id", protect, updateMemberProfilePicture);
router.delete("/delete/:id", protect, deleteMember);
router.post("/:id/subscribe", protect, subscribeMember);
router.post("/:id/unsubscribe", protect, unsubscribeMember);

export default router;
