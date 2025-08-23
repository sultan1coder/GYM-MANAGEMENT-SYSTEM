import { Router } from "express";
import {
  addEquipment,
  deleteEquipment,
  getAllEquipment,
  getSingleEquipment,
  updateEquipment,
} from "../controllers/equipment.controller";
import { adminRoute, protect } from "../../middlewares/auth.middleware";
const router = Router();

router.post("/add", protect, adminRoute, addEquipment);
router.get("/list", getAllEquipment);
router.get("/single/:id", getSingleEquipment);
router.put("/update/:id", protect, adminRoute, updateEquipment);
router.delete("/delete/:id", protect, adminRoute, deleteEquipment);

export default router;
