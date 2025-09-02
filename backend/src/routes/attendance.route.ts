import { Router } from "express";
import {
  memberCheckIn,
  memberCheckOut,
  getTodayAttendance,
  getAttendanceStats,
  getMemberAttendanceHistory,
  getCurrentlyCheckedInMembers,
} from "../controllers/attendance.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

// Member check-in/check-out routes
router.post("/checkin/:memberId", protect, memberCheckIn);
router.post("/checkout/:memberId", protect, memberCheckOut);

// Attendance data routes
router.get("/today", protect, getTodayAttendance);
router.get("/stats", protect, getAttendanceStats);
router.get("/current", protect, getCurrentlyCheckedInMembers);
router.get("/history/:memberId", protect, getMemberAttendanceHistory);

export default router;
