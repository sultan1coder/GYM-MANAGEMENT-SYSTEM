import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getSingleUser,
  updateUser,
} from "../controllers/user.controller";
import { protect, adminRoute } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/list", protect, getAllUsers);
router.get("/single/:id", protect, getSingleUser);
router.put("/update/:id", protect, updateUser);
router.delete("/delete/:id", protect, adminRoute, deleteUser);

export default router;
