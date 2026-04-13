import { Router } from "express";
import { protect, requireRole } from "../middleware/auth.js";
import { getCommissions, createCommission, updateCommission } from "../controllers/admin.controller.js";

const router = Router();
router.get("/", protect, requireRole("admin"), getCommissions);
router.post("/", protect, requireRole("admin"), createCommission);
router.put("/:id", protect, requireRole("admin"), updateCommission);
export default router;
