import VendorBankDetail from "../models/VendorBankDetail.js";
import Vendor from "../models/Vendor.js";

// Get vendor's bank details
export const getBankDetails = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });
    const banks = await VendorBankDetail.find({ vendorId: vendor._id, status: true }).sort("-isPrimary");
    res.json({ success: true, data: banks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Add bank detail
export const addBankDetail = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });

    const data = { ...req.body, vendorId: vendor._id };
    // If this is the first, make it primary
    const existing = await VendorBankDetail.countDocuments({ vendorId: vendor._id, status: true });
    if (existing === 0) data.isPrimary = true;
    // If setting as primary, unset others
    if (data.isPrimary) {
      await VendorBankDetail.updateMany({ vendorId: vendor._id }, { isPrimary: false });
    }
    const bank = await VendorBankDetail.create(data);
    res.status(201).json({ success: true, data: bank });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update bank detail
export const updateBankDetail = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (req.body.isPrimary) {
      await VendorBankDetail.updateMany({ vendorId: vendor._id }, { isPrimary: false });
    }
    const bank = await VendorBankDetail.findOneAndUpdate(
      { _id: req.params.bankId, vendorId: vendor._id },
      req.body,
      { new: true }
    );
    if (!bank) return res.status(404).json({ success: false, message: "Bank detail not found" });
    res.json({ success: true, data: bank });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete bank detail
export const deleteBankDetail = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    await VendorBankDetail.findOneAndUpdate(
      { _id: req.params.bankId, vendorId: vendor._id },
      { status: false }
    );
    res.json({ success: true, message: "Bank detail removed" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Set primary
export const setPrimaryBank = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    await VendorBankDetail.updateMany({ vendorId: vendor._id }, { isPrimary: false });
    await VendorBankDetail.findByIdAndUpdate(req.params.bankId, { isPrimary: true });
    res.json({ success: true, message: "Primary bank updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: get vendor bank details
export const getVendorBankDetailsAdmin = async (req, res) => {
  try {
    const banks = await VendorBankDetail.find({ vendorId: req.params.vendorId, status: true });
    res.json({ success: true, data: banks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: verify bank detail
export const verifyBankDetail = async (req, res) => {
  try {
    const bank = await VendorBankDetail.findByIdAndUpdate(req.params.bankId, { isVerified: req.body.isVerified }, { new: true });
    res.json({ success: true, data: bank });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
