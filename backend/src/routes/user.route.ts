import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  updateProfilePicture,
  createUserByAdmin,
  bulkImportUsers,
  getUserTemplates,
  inviteUser,
  resendInvitation,
} from "../controllers/user.controller";
import { protect, adminRoute } from "../../middlewares/auth.middleware";
import multer from "multer";
import path from "path";

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.csv', '.xlsx', '.xls'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only CSV and Excel files are allowed.'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Existing routes
router.get("/list", protect, getAllUsers);
router.get("/single/:id", protect, getSingleUser);
router.put("/update/:id", protect, updateUser);
router.put("/profile-picture/:id", protect, updateProfilePicture);
router.delete("/delete/:id", protect, adminRoute, deleteUser);

// New admin-only routes
router.post("/create", protect, adminRoute, createUserByAdmin);
router.post("/bulk-import", protect, adminRoute, upload.single('file'), bulkImportUsers);
router.get("/templates", protect, adminRoute, getUserTemplates);
router.post("/invite", protect, adminRoute, inviteUser);
router.post("/resend-invitation/:id", protect, adminRoute, resendInvitation);

export default router;
