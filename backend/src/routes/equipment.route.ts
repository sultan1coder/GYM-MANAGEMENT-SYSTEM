import { Router } from "express";
import {
  addEquipment,
  deleteEquipment,
  getAllEquipment,
  getSingleEquipment,
  updateEquipment,
  updateEquipmentStatus,
  addMaintenanceLog,
  getEquipmentStats,
  getMaintenanceLogs,
  checkOutEquipment,
  checkInEquipment,
} from "../controllers/equipment.controller";
import { adminRoute, protect } from "../../middlewares/auth.middleware";

const router = Router();

// Equipment CRUD operations (Admin only)
router.post("/add", protect, adminRoute, addEquipment);
router.get("/list", getAllEquipment);
router.get("/single/:id", getSingleEquipment);
router.put("/update/:id", protect, adminRoute, updateEquipment);
router.delete("/delete/:id", protect, adminRoute, deleteEquipment);

// Equipment status and maintenance (Admin/Staff)
router.put("/status/:id", protect, updateEquipmentStatus);
router.post("/maintenance/:id", protect, addMaintenanceLog);
router.get("/maintenance", protect, getMaintenanceLogs);

// Equipment usage tracking (Staff)
router.post("/checkout/:id", protect, checkOutEquipment);
router.post("/checkin/:id", protect, checkInEquipment);

// Equipment statistics (Admin/Staff)
router.get("/stats", protect, getEquipmentStats);

export default router;
