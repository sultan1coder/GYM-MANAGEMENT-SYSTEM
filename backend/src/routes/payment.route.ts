import { Router } from "express";
import {
  createPayment,
  generateInvoice,
  getAllPayment,
  getHistoryOfSpecificMember,
  getReports,
  getSpecificPayment,
} from "../controllers/payment.controller";
import { protect, adminRoute } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/list", protect, adminRoute, getAllPayment);
router.get("/single/:id", protect, adminRoute, getSpecificPayment);
router.get("/member/:memberId/payments", protect, getHistoryOfSpecificMember);
router.post("/create", protect, adminRoute, createPayment);
router.post("/invoice", protect, adminRoute, generateInvoice);
router.get("/reports", protect, adminRoute, getReports);

export default router;
