import { Router } from "express";
import { createPayment, generateInvoice, getAllPayment, getHistoryOfSpecificMember, getReports, getSpecificPayment } from "../controllers/payment.controller";


const router = Router();

router.get("/list", getAllPayment);
router.get("/single/:id", getSpecificPayment);
router.get("/single/:memberId", getHistoryOfSpecificMember);
router.post("/create", createPayment);
router.post("/invoice", generateInvoice);
router.get("/reports", getReports);

export default router;