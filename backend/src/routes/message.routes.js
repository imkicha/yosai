import { Router } from "express";
import Message from "../models/Message.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.get("/:conversationId", protect, async (req, res) => {
  const msgs = await Message.find({ conversationId: req.params.conversationId })
    .populate("senderId", "name avatar role").sort("createdAt");
  res.json({ success: true, data: msgs });
});
router.post("/", protect, async (req, res) => {
  const { conversationId, receiverId, receiverRole, orderId, message } = req.body;
  const msg = await Message.create({ conversationId, senderId: req.user._id, senderRole: req.user.role, receiverId, receiverRole, orderId, message });
  res.status(201).json({ success: true, data: msg });
});
export default router;
