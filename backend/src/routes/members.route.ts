import { Router } from "express";
import {
  deleteMember,
  getAllMembers,
  getSingleMember,
  loginMember,
  registerMember,
  updateMember,
  updateMemberProfilePicture,
  uploadMemberProfilePicture,
  searchMembers,
  getMemberStats,
  bulkImportMembers,
} from "../controllers/members.controller";
import {
  subscribeMember,
  unsubscribeMember,
} from "../controllers/subscription.controller";
import { protect } from "../../middlewares/auth.middleware";
import multer from "multer";
import path from "path";

const router = Router();

// Configure multer for CSV/Excel file uploads
const csvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const csvUpload = multer({
  storage: csvStorage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [".csv", ".xlsx", ".xls"];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only CSV and Excel files are allowed."));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Configure multer for image uploads
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      "profile-" + file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const imageUpload = multer({
  storage: imageStorage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only image files are allowed."));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Existing routes
router.get("/list", protect, getAllMembers);
router.post("/login", loginMember);
router.post("/register", registerMember);
router.get("/single/:id", protect, getSingleMember);
router.put("/update/:id", protect, updateMember);
router.put("/profile-picture/:id", protect, updateMemberProfilePicture);
router.post("/upload-profile-picture/:id", protect, imageUpload.single("profile_picture"), uploadMemberProfilePicture);
router.delete("/delete/:id", protect, deleteMember);
router.post("/:id/subscribe", protect, subscribeMember);
router.post("/:id/unsubscribe", protect, unsubscribeMember);

// New advanced routes
router.get("/search", protect, searchMembers);
router.get("/stats", protect, getMemberStats);
router.post("/bulk-import", protect, csvUpload.single("file"), bulkImportMembers);

export default router;
