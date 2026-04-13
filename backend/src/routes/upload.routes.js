import { Router } from "express";
import { protect } from "../middleware/auth.js";
import cloudinary from "../config/cloudinary.js";

const router = Router();

// Upload base64 image to Cloudinary
router.post("/", protect, async (req, res) => {
  try {
    const { file, folder = "uploads" } = req.body;
    if (!file) return res.status(400).json({ success: false, message: "No file provided" });

    const result = await cloudinary.uploader.upload(file, {
      folder: `yosai/${folder}`,
      resource_type: "auto",
    });

    res.json({ success: true, data: { url: result.secure_url, publicId: result.public_id } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
