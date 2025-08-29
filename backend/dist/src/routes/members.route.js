"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const members_controller_1 = require("../controllers/members.controller");
const subscription_controller_1 = require("../controllers/subscription.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
const csvStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
const csvUpload = (0, multer_1.default)({
    storage: csvStorage,
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
        fileSize: 10 * 1024 * 1024,
    },
});
const imageStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, "profile-" +
            file.fieldname +
            "-" +
            uniqueSuffix +
            path_1.default.extname(file.originalname));
    },
});
const imageUpload = (0, multer_1.default)({
    storage: imageStorage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/webp",
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error("Invalid file type. Only image files are allowed."));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});
router.get("/list", auth_middleware_1.protect, members_controller_1.getAllMembers);
router.post("/login", members_controller_1.loginMember);
router.post("/register", members_controller_1.registerMember);
router.get("/single/:id", auth_middleware_1.protect, members_controller_1.getSingleMember);
router.put("/update/:id", auth_middleware_1.protect, members_controller_1.updateMember);
router.put("/profile-picture/:id", auth_middleware_1.protect, members_controller_1.updateMemberProfilePicture);
router.post("/upload-profile-picture/:id", auth_middleware_1.protect, imageUpload.single("profile_picture"), members_controller_1.uploadMemberProfilePicture);
router.delete("/delete/:id", auth_middleware_1.protect, members_controller_1.deleteMember);
router.post("/:id/subscribe", auth_middleware_1.protect, subscription_controller_1.subscribeMember);
router.post("/:id/unsubscribe", auth_middleware_1.protect, subscription_controller_1.unsubscribeMember);
router.get("/search", auth_middleware_1.protect, members_controller_1.searchMembers);
router.get("/stats", auth_middleware_1.protect, members_controller_1.getMemberStats);
router.post("/bulk-import", auth_middleware_1.protect, csvUpload.single("file"), members_controller_1.bulkImportMembers);
router.put("/basic-profile/:id", auth_middleware_1.protect, members_controller_1.updateMemberBasicProfile);
router.put("/change-password/:id", auth_middleware_1.protect, members_controller_1.changeMemberPassword);
exports.default = router;
//# sourceMappingURL=members.route.js.map