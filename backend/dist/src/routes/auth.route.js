"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post("/register", auth_controller_1.registerUser);
router.post("/login", auth_controller_1.loginUser);
router.post("/forgot-password", auth_controller_1.forgotPassword);
router.post("/reset-password", auth_controller_1.resetPassword);
router.post("/refresh", auth_controller_1.refreshToken);
router.post("/logout", auth_middleware_1.protect, auth_controller_1.logoutUser);
router.get("/me", auth_middleware_1.protect, auth_controller_1.whoami);
exports.default = router;
//# sourceMappingURL=auth.route.js.map