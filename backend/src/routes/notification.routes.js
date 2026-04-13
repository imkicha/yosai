import { Router } from "express";
import Notification from "../models/Notification.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.get("/", protect, async (req, res) => {
  const notifs = await Notification.find({ userId: req.user._id }).sort("-createdAt").limit(30);
  res.json({ success: true, data: notifs });
});
router.patch("/:id/read", protect, async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ success: true });
});
router.patch("/read-all", protect, async (req, res) => {
  await Notification.updateMany({ userId: req.user._id }, { isRead: true });
  res.json({ success: true });
});
export default router;
