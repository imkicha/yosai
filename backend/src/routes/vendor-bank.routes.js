import { Router } from "express";
import { protect, requireRole } from "../middleware/auth.js";
import {
  getBankDetails, addBankDetail, updateBankDetail, deleteBankDetail, setPrimaryBank,
  getVendorBankDetailsAdmin, verifyBankDetail,
} from "../controllers/vendor-bank.controller.js";

const router = Router();

// Vendor
router.get("/", protect, requireRole("vendor"), getBankDetails);
router.post("/", protect, requireRole("vendor"), addBankDetail);
router.put("/:bankId", protect, requireRole("vendor"), updateBankDetail);
router.delete("/:bankId", protect, requireRole("vendor"), deleteBankDetail);
router.patch("/:bankId/primary", protect, requireRole("vendor"), setPrimaryBank);

// Admin
router.get("/admin/:vendorId", protect, requireRole("admin"), getVendorBankDetailsAdmin);
router.patch("/admin/:bankId/verify", protect, requireRole("admin"), verifyBankDetail);

export default router;
