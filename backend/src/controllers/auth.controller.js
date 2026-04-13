import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Vendor from "../models/Vendor.js";
import { getOrCreateWallet } from "../services/wallet.service.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "30d" });

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ success: false, message: "Email already registered" });

    const user = await User.create({ name, email, password, phone, role: role || "customer" });
    await getOrCreateWallet(user._id, user.role === "vendor" ? "vendor" : "customer");

    res.status(201).json({ success: true, token: signToken(user._id), user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: "Invalid email or password" });

    if (!user.isActive)
      return res.status(403).json({ success: false, message: "Account suspended" });

    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

    let vendorProfile = null;
    if (user.role === "vendor") {
      vendorProfile = await Vendor.findOne({ userId: user._id }).select("status brandName slug _id");
    }

    res.json({
      success: true,
      token: signToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
      vendor: vendorProfile,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    let vendor = null;
    if (user.role === "vendor") {
      vendor = await Vendor.findOne({ userId: user._id });
    }
    res.json({ success: true, user, vendor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, phone, avatar }, { new: true }).select("-password");
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
