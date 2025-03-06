import { Router } from "express";
import { addEquipment, deleteEquipment, getAllEquipment, getSingleEquipment, updateEquipment } from "../controllers/equipment.controller";
const router = Router();

router.post("/add", addEquipment);
router.get("/list", getAllEquipment);
router.get("/single/:id", getSingleEquipment);
router.put("/update/:id", updateEquipment);
router.delete("/delete/:id", deleteEquipment);

export default router;