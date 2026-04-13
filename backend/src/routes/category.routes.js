import { Router } from "express";
import Category from "../models/Category.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = Router();
router.get("/", async (req, res) => {
  const cats = await Category.find({ isActive: true }).sort("sortOrder");
  res.json({ success: true, data: cats });
});
router.post("/", protect, requireRole("admin"), async (req, res) => {
  const cat = await Category.create(req.body);
  res.status(201).json({ success: true, data: cat });
});
router.put("/:id", protect, requireRole("admin"), async (req, res) => {
  const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, data: cat });
});
router.delete("/:id", protect, requireRole("admin"), async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Deleted" });
});
export default router;
