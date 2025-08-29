"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controllers/payment.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get("/list", auth_middleware_1.protect, auth_middleware_1.adminRoute, payment_controller_1.getAllPayment);
router.get("/single/:id", auth_middleware_1.protect, auth_middleware_1.adminRoute, payment_controller_1.getSpecificPayment);
router.get("/member/:memberId/payments", auth_middleware_1.protect, auth_middleware_1.adminRoute, payment_controller_1.getHistoryOfSpecificMember);
router.get("/reports", auth_middleware_1.protect, auth_middleware_1.adminRoute, payment_controller_1.getReports);
router.post("/create", auth_middleware_1.protect, auth_middleware_1.adminRoute, payment_controller_1.createPayment);
router.post("/invoice", auth_middleware_1.protect, auth_middleware_1.adminRoute, payment_controller_1.generateInvoice);
router.put("/update/:id", auth_middleware_1.protect, auth_middleware_1.adminRoute, payment_controller_1.updatePayment);
router.delete("/delete/:id", auth_middleware_1.protect, auth_middleware_1.adminRoute, payment_controller_1.deletePayment);
exports.default = router;
//# sourceMappingURL=payment.route.js.map