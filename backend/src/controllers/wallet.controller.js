import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import Vendor from "../models/Vendor.js";
import PayoutRequest from "../models/PayoutRequest.js";
import { createNotification } from "../services/notification.service.js";

export const getWallet = async (req, res) => {
  try {
    const ownerType = req.user.role === "vendor" ? "vendor" : "customer";
    let ownerId = req.user._id;
    if (ownerType === "vendor") {
      const vendor = await Vendor.findOne({ userId: req.user._id });
      ownerId = vendor._id;
    }
    const wallet = await Wallet.findOne({ ownerId, ownerType });
    res.json({ success: true, data: wallet || { balance: 0 } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const ownerType = req.user.role === "vendor" ? "vendor" : "customer";
    let ownerId = req.user._id;
    if (ownerType === "vendor") {
      const vendor = await Vendor.findOne({ userId: req.user._id });
      ownerId = vendor._id;
    }
    const wallet = await Wallet.findOne({ ownerId, ownerType });
    if (!wallet) return res.json({ success: true, data: [] });
    const txns = await Transaction.find({ walletId: wallet._id }).sort("-createdAt").limit(50);
    res.json({ success: true, data: txns });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const requestPayout = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor profile not found" });

    const { amount } = req.body;
    if (!amount || amount < 100) return res.status(400).json({ success: false, message: "Minimum payout amount is ₹100" });

    const wallet = await Wallet.findOne({ ownerId: vendor._id, ownerType: "vendor" });
    if (!wallet || wallet.balance < amount)
      return res.status(400).json({ success: false, message: "Insufficient balance" });

    // Check for pending payout request
    const existing = await PayoutRequest.findOne({ vendorId: vendor._id, status: "pending" });
    if (existing) return res.status(400).json({ success: false, message: "You already have a pending payout request" });

    const payoutReq = await PayoutRequest.create({ vendorId: vendor._id, amount });

    await createNotification({
      userId: req.user._id,
      title: "Payout Requested",
      message: `Your payout request of ₹${amount} has been submitted. Admin will process within 2-3 business days.`,
      type: "payout_processed",
      referenceId: payoutReq._id.toString(),
    });

    res.json({ success: true, message: "Payout request submitted.", data: payoutReq });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPayoutRequests = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor profile not found" });
    const payouts = await PayoutRequest.find({ vendorId: vendor._id }).sort("-createdAt");
    res.json({ success: true, data: payouts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
