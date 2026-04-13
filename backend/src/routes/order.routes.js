import { Router } from "express";
import {
  createRazorpayOrder,
  verifyAndPlaceOrder,
  getMyOrders,
  getOrderDetail,
  getVendorOrders,
  updateSubOrderStatus,
  createSubOrderShipment,
  assignSubOrderAWB,
  scheduleSubOrderPickup,
} from "../controllers/order.controller.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = Router();

// Customer
router.post("/razorpay", protect, createRazorpayOrder);
router.post("/place", protect, verifyAndPlaceOrder);
router.get("/my", protect, getMyOrders);
router.get("/my/:orderId", protect, getOrderDetail);

// Vendor
router.get("/vendor", protect, requireRole("vendor"), getVendorOrders);
router.patch("/vendor/status", protect, requireRole("vendor"), updateSubOrderStatus);

// Shiprocket actions (vendor)
router.post("/:orderId/suborders/:subOrderId/shipment", protect, requireRole("vendor"), createSubOrderShipment);
router.post("/:orderId/suborders/:subOrderId/awb", protect, requireRole("vendor"), assignSubOrderAWB);
router.post("/:orderId/suborders/:subOrderId/pickup", protect, requireRole("vendor"), scheduleSubOrderPickup);

export default router;
