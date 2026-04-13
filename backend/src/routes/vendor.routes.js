import { Router } from "express";
import { registerVendor, getMyVendorProfile, updateVendorProfile, uploadDocument } from "../controllers/vendor.controller.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = Router();
router.post("/register", protect, registerVendor);
router.get("/me", protect, requireRole("vendor"), getMyVendorProfile);
router.put("/me", protect, requireRole("vendor"), updateVendorProfile);
router.post("/documents", protect, requireRole("vendor"), uploadDocument);
export default router;
