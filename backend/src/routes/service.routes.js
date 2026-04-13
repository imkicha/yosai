import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { createNotification } from "../services/notification.service.js";
import User from "../models/User.js";

const router = Router();

// Contact form submission
router.post("/contact", async (req, res) => {
  try {
    const { name, email, phoneno, message } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ success: false, message: "Name, email and message are required" });

    // Notify admin (find admin user)
    const admin = await User.findOne({ role: "admin" });
    if (admin) {
      await createNotification({
        userId: admin._id,
        title: "New Contact Message",
        message: `${name} (${email}): ${message.substring(0, 100)}`,
        type: "low_stock",
        referenceId: email,
      });
    }

    res.json({ success: true, message: "Message received. We will get back to you shortly." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Callback request
router.post("/callback", async (req, res) => {
  try {
    const { name, phone, preferredTime } = req.body;
    if (!name || !phone)
      return res.status(400).json({ success: false, message: "Name and phone are required" });

    const admin = await User.findOne({ role: "admin" });
    if (admin) {
      await createNotification({
        userId: admin._id,
        title: "Callback Requested",
        message: `${name} (${phone}) requested a callback${preferredTime ? ` at ${preferredTime}` : ""}.`,
        type: "low_stock",
        referenceId: phone,
      });
    }

    res.json({ success: true, message: "Callback request received. We will call you soon." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Stitch service booking
router.post("/bookings", protect, async (req, res) => {
  try {
    const { serviceType, measurements, fabricDescription, preferredDate, notes } = req.body;

    // Notify admin about new booking
    const admin = await User.findOne({ role: "admin" });
    if (admin) {
      await createNotification({
        userId: admin._id,
        title: "New Stitch Booking",
        message: `User ${req.user.name} booked ${serviceType} service for ${preferredDate || "any date"}.`,
        type: "new_order",
        referenceId: req.user._id.toString(),
      });
    }

    await createNotification({
      userId: req.user._id,
      title: "Booking Confirmed",
      message: `Your ${serviceType} service booking has been received. We will confirm shortly.`,
      type: "order_placed",
      referenceId: req.user._id.toString(),
    });

    res.status(201).json({ success: true, message: "Booking submitted successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
