import Product from "../models/Product.js";
import Vendor from "../models/Vendor.js";
import { createNotification } from "../services/notification.service.js";

export const getProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort, page = 1, limit = 20, featured } = req.query;
    const filter = { status: "approved" };
    if (category) filter.category = category;
    if (featured) filter.featured = true;
    if (search) filter.name = { $regex: search, $options: "i" };
    if (minPrice || maxPrice) {
      filter["variants.price"] = {};
      if (minPrice) filter["variants.price"].$gte = Number(minPrice);
      if (maxPrice) filter["variants.price"].$lte = Number(maxPrice);
    }
    const sortMap = { newest: "-createdAt", popular: "-totalSold", rating: "-rating", "price-asc": "variants.price", "price-desc": "-variants.price" };
    const products = await Product.find(filter)
      .populate("vendorId", "brandName slug logo")
      .populate("category", "name slug")
      .sort(sortMap[sort] || "-createdAt")
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Product.countDocuments(filter);
    res.json({ success: true, data: products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, status: "approved" })
      .populate("vendorId", "brandName slug logo phone")
      .populate("category", "name slug");
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor || vendor.status !== "approved")
      return res.status(403).json({ success: false, message: "Vendor not approved" });
    const product = await Product.create({ ...req.body, vendorId: vendor._id, status: "pending_approval" });
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    const product = await Product.findOne({ _id: req.params.id, vendorId: vendor._id });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    Object.assign(product, req.body);
    if (product.status === "approved") product.status = "pending_approval"; // re-approve on edit
    await product.save();
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    await Product.findOneAndDelete({ _id: req.params.id, vendorId: vendor._id });
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getVendorProducts = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    const { status, page = 1, limit = 20 } = req.query;
    const filter = { vendorId: vendor._id };
    if (status) filter.status = status;
    const products = await Product.find(filter)
      .populate("category", "name")
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Product.countDocuments(filter);
    res.json({ success: true, data: products, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateStock = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    const { variantId, stock } = req.body;
    const product = await Product.findOne({ _id: req.params.id, vendorId: vendor._id });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    const variant = product.variants.id(variantId);
    if (!variant) return res.status(404).json({ success: false, message: "Variant not found" });
    variant.stock = stock;
    await product.save();
    // Low stock alert
    if (stock <= (vendor.lowStockThreshold || 5)) {
      await createNotification({ userId: req.user._id, title: "Low Stock Alert", message: `${product.name} is running low on stock (${stock} left).`, type: "low_stock", referenceId: product._id.toString() });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
