"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subscription_controller_1 = require("../controllers/subscription.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get("/list", auth_middleware_1.protect, subscription_controller_1.getAllPlans);
router.get("/single/:id", auth_middleware_1.protect, subscription_controller_1.getSinglePlan);
router.post("/create", auth_middleware_1.protect, auth_middleware_1.adminRoute, subscription_controller_1.createPlan);
router.put("/update/:id", auth_middleware_1.protect, auth_middleware_1.adminRoute, subscription_controller_1.updatePlan);
router.delete("/delete/:id", auth_middleware_1.protect, auth_middleware_1.adminRoute, subscription_controller_1.deletePlan);
exports.default = router;
//# sourceMappingURL=subscription.route.js.map