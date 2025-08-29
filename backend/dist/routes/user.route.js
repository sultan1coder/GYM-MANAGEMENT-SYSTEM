"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = [".csv", ".xlsx", ".xls"];
        const fileExtension = path_1.default.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(fileExtension)) {
            cb(null, true);
        }
        else {
            cb(new Error("Invalid file type. Only CSV and Excel files are allowed."));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});
router.get("/list", auth_middleware_1.protect, user_controller_1.getAllUsers);
router.get("/single/:id", auth_middleware_1.protect, user_controller_1.getSingleUser);
router.put("/update/:id", auth_middleware_1.protect, user_controller_1.updateUser);
router.put("/profile-picture/:id", auth_middleware_1.protect, user_controller_1.updateProfilePicture);
router.delete("/delete/:id", auth_middleware_1.protect, auth_middleware_1.adminRoute, user_controller_1.deleteUser);
router.post("/create", auth_middleware_1.protect, auth_middleware_1.adminRoute, user_controller_1.createUserByAdmin);
router.post("/bulk-import", auth_middleware_1.protect, auth_middleware_1.adminRoute, upload.single("file"), user_controller_1.bulkImportUsers);
router.get("/templates", auth_middleware_1.protect, auth_middleware_1.adminRoute, user_controller_1.getUserTemplates);
router.post("/invite", auth_middleware_1.protect, auth_middleware_1.adminRoute, user_controller_1.inviteUser);
router.post("/resend-invitation/:id", auth_middleware_1.protect, auth_middleware_1.adminRoute, user_controller_1.resendInvitation);
router.get("/search", auth_middleware_1.protect, user_controller_1.searchUsers);
router.put("/status/:id", auth_middleware_1.protect, auth_middleware_1.adminRoute, user_controller_1.updateUserStatus);
router.get("/activity/:id", auth_middleware_1.protect, user_controller_1.getUserActivity);
router.post("/bulk-update-roles", auth_middleware_1.protect, auth_middleware_1.adminRoute, user_controller_1.bulkUpdateUserRoles);
router.get("/profile/:id", auth_middleware_1.protect, user_controller_1.getUserProfile);
router.put("/profile/:id", auth_middleware_1.protect, user_controller_1.updateUserProfile);
exports.default = router;
//# sourceMappingURL=user.route.js.map