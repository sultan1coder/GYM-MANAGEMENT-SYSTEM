"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const equipment_controller_1 = require("../controllers/equipment.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post("/add", auth_middleware_1.protect, auth_middleware_1.adminRoute, equipment_controller_1.addEquipment);
router.get("/list", equipment_controller_1.getAllEquipment);
router.get("/single/:id", equipment_controller_1.getSingleEquipment);
router.put("/update/:id", auth_middleware_1.protect, auth_middleware_1.adminRoute, equipment_controller_1.updateEquipment);
router.delete("/delete/:id", auth_middleware_1.protect, auth_middleware_1.adminRoute, equipment_controller_1.deleteEquipment);
router.put("/status/:id", auth_middleware_1.protect, equipment_controller_1.updateEquipmentStatus);
router.post("/maintenance/:id", auth_middleware_1.protect, equipment_controller_1.addMaintenanceLog);
router.get("/maintenance", auth_middleware_1.protect, equipment_controller_1.getMaintenanceLogs);
router.post("/checkout/:id", auth_middleware_1.protect, equipment_controller_1.checkOutEquipment);
router.post("/checkin/:id", auth_middleware_1.protect, equipment_controller_1.checkInEquipment);
router.get("/stats", auth_middleware_1.protect, equipment_controller_1.getEquipmentStats);
exports.default = router;
//# sourceMappingURL=equipment.route.js.map