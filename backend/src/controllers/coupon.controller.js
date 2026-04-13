import Coupon, { CouponUsage } from "../models/Coupon.js";
import Vendor from "../models/Vendor.js";

// Create coupon (admin or vendor)
export const createCoupon = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.user.role === "vendor") {
      const vendor = await Vendor.findOne({ userId: req.user._id });
      data.vendorId = vendor._id;
    }
    if (await Coupon.findOne({ code: data.code?.toUpperCase() }))
      return res.status(400).json({ success: false, message: "Coupon code already exists" });

    const coupon = await Coupon.create(data);
    res.status(201).json({ success: true, data: coupon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// List coupons
export const getCoupons = async (req, res) => {
  try {
    const { page = 1, limit = 20, vendorId, active } = req.query;
    const filter = {};
    if (vendorId) filter.vendorId = vendorId;
    if (active === "true") { filter.isActive = true; filter.validTill = { $gte: new Date() }; }
    if (req.user.role === "vendor") {
      const vendor = await Vendor.findOne({ userId: req.user._id });
      filter.vendorId = vendor._id;
    }
    const coupons = await Coupon.find(filter).sort("-createdAt").skip((page - 1) * limit).limit(Number(limit));
    const total = await Coupon.countDocuments(filter);
    res.json({ success: true, data: coupons, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update coupon
export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });
    res.json({ success: true, data: coupon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete coupon
export const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Coupon deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Validate coupon (customer)
export const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    const coupon = await Coupon.findOne({ code: code?.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ success: false, message: "Invalid coupon code" });
    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validTill)
      return res.status(400).json({ success: false, message: "Coupon expired" });
    if (coupon.maxUsageLimit && coupon.usedCount >= coupon.maxUsageLimit)
      return res.status(400).json({ success: false, message: "Coupon usage limit reached" });
    if (cartTotal < coupon.minPurchaseAmount)
      return res.status(400).json({ success: false, message: `Minimum purchase of ₹${coupon.minPurchaseAmount} required` });

    // Check per-user usage
    const userUsage = await CouponUsage.countDocuments({ couponId: coupon._id, userId: req.user._id });
    if (userUsage >= coupon.maxUsagePerCustomer)
      return res.status(400).json({ success: false, message: "You have already used this coupon" });

    let discount = coupon.discountType === "percentage"
      ? (cartTotal * coupon.discountValue) / 100
      : coupon.discountValue;
    if (coupon.maxDiscountAmount) discount = Math.min(discount, coupon.maxDiscountAmount);

    res.json({ success: true, data: { couponId: coupon._id, code: coupon.code, discount: Math.round(discount), discountType: coupon.discountType, discountValue: coupon.discountValue } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: get all coupons
export const getAllCoupons = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const coupons = await Coupon.find().populate("vendorId", "brandName").sort("-createdAt").skip((page - 1) * limit).limit(Number(limit));
    const total = await Coupon.countDocuments();
    res.json({ success: true, data: coupons, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
