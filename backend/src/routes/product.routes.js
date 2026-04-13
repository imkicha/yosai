import { Router } from "express";
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getVendorProducts, updateStock } from "../controllers/product.controller.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = Router();
router.get("/", getProducts);
// Specific paths before wildcard /:id
router.get("/vendor/my", protect, requireRole("vendor"), getVendorProducts);
router.get("/:id", getProduct);
router.post("/", protect, requireRole("vendor"), createProduct);
router.put("/:id", protect, requireRole("vendor"), updateProduct);
router.delete("/:id", protect, requireRole("vendor"), deleteProduct);
router.patch("/:id/stock", protect, requireRole("vendor"), updateStock);
export default router;
