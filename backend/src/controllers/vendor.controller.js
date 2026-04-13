import Vendor from "../models/Vendor.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import { getOrCreateWallet } from "../services/wallet.service.js";
import { createPickupLocation } from "../services/shiprocket.service.js";

export const registerVendor = async (req, res) => {
  try {
    const existing = await Vendor.findOne({ userId: req.user._id });
    if (existing) return res.status(400).json({ success: false, message: "Already registered as vendor" });
    const vendor = await Vendor.create({ ...req.body, userId: req.user._id, status: "pending" });
    await User.findByIdAndUpdate(req.user._id, { role: "vendor" });
    await getOrCreateWallet(vendor._id, "vendor");
    res.status(201).json({ success: true, data: vendor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMyVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id }).populate("wallet");
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor profile not found" });
    const productCount = await Product.countDocuments({ vendorId: vendor._id });
    const vendorData = vendor.toObject();
    vendorData.productCount = productCount;
    res.json({ success: true, data: vendorData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findOneAndUpdate({ userId: req.user._id }, req.body, { new: true });
    res.json({ success: true, data: vendor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const uploadDocument = async (req, res) => {
  try {
    const { label, url } = req.body;
    const vendor = await Vendor.findOne({ userId: req.user._id });
    vendor.kyc.documents.push({ label, url, status: "pending" });
    await vendor.save();
    res.json({ success: true, data: vendor.kyc.documents });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
