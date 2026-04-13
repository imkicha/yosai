import { Router } from "express";
import { protect, requireRole } from "../middleware/auth.js";
import {
  createCoupon, getCoupons, updateCoupon, deleteCoupon, validateCoupon, getAllCoupons,
} from "../controllers/coupon.controller.js";

const router = Router();

// Customer
router.post("/validate", protect, validateCoupon);

// Vendor
router.post("/", protect, requireRole("vendor"), createCoupon);
router.get("/", protect, requireRole("vendor"), getCoupons);
router.put("/:id", protect, requireRole("vendor"), updateCoupon);
router.delete("/:id", protect, requireRole("vendor"), deleteCoupon);

// Admin
router.get("/admin", protect, requireRole("admin"), getAllCoupons);
router.post("/admin", protect, requireRole("admin"), createCoupon);
router.put("/admin/:id", protect, requireRole("admin"), updateCoupon);
router.delete("/admin/:id", protect, requireRole("admin"), deleteCoupon);

export default router;
