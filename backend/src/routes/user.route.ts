import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  updateProfilePicture,
} from "../controllers/user.controller";
import { protect, adminRoute } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/list", protect, getAllUsers);
router.get("/single/:id", protect, getSingleUser);
router.put("/update/:id", protect, updateUser);
router.put("/profile-picture/:id", protect, updateProfilePicture);
router.delete("/delete/:id", protect, adminRoute, deleteUser);

export default router;
