import { Router } from "express";
import { addEquipment, deleteEquipment, getAllEquipment, getSingleEquipment, updateEquipment } from "../controllers/equipment.controller";
import { adminRoute } from "../../middlewares/auth.middleware";
const router = Router();

router.post("/add",adminRoute, addEquipment);
router.get("/list", getAllEquipment);
router.get("/single/:id", getSingleEquipment);
router.put("/update/:id",adminRoute, updateEquipment);
router.delete("/delete/:id",adminRoute, deleteEquipment);

export default router;