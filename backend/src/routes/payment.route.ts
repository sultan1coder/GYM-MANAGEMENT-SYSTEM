import { Router } from "express";
import {
  createPayment,
  generateInvoice,
  getAllPayment,
  getHistoryOfSpecificMember,
  getReports,
  getSpecificPayment,
  updatePayment,
  deletePayment,
} from "../controllers/payment.controller";
import { protect, adminRoute } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/list", protect, adminRoute, getAllPayment);
router.get("/single/:id", protect, adminRoute, getSpecificPayment);
router.get("/member/:memberId/payments", protect, adminRoute, getHistoryOfSpecificMember);
router.get("/reports", protect, adminRoute, getReports);

router.post("/create", protect, adminRoute, createPayment);
router.post("/invoice", protect, adminRoute, generateInvoice);

router.put("/update/:id", protect, adminRoute, updatePayment);
router.delete("/delete/:id", protect, adminRoute, deletePayment);

export default router;
