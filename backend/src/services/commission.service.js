import Commission from "../models/Commission.js";
import Vendor from "../models/Vendor.js";

export const calculateCommission = async (orderAmount, vendorId) => {
  // Check vendor-specific override first
  const vendor = await Vendor.findById(vendorId).populate("commissionOverride");
  const config = vendor?.commissionOverride?.isActive
    ? vendor.commissionOverride
    : await Commission.findOne({ isDefault: true, isActive: true });

  if (!config) return { rate: 0.05, amount: Math.round(orderAmount * 0.05) };

  const slab = config.slabs.find(
    (s) => orderAmount >= s.minAmount && (s.maxAmount === null || orderAmount < s.maxAmount)
  );

  const rate = slab?.rate ?? 0.05;
  return { rate, amount: Math.round(orderAmount * rate) };
};
