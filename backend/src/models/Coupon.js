import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", default: null, index: true },
    discountType: { type: String, enum: ["flat", "percentage"], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    minPurchaseAmount: { type: Number, default: 0 },
    maxDiscountAmount: { type: Number, default: null },
    validFrom: { type: Date, required: true },
    validTill: { type: Date, required: true },
    maxUsageLimit: { type: Number, default: null },
    maxUsagePerCustomer: { type: Number, default: 1 },
    usedCount: { type: Number, default: 0 },
    applicableCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const CouponUsageSchema = new mongoose.Schema(
  {
    couponId: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderId: { type: String, required: true },
    discountAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

export const CouponUsage = mongoose.model("CouponUsage", CouponUsageSchema);
export default mongoose.model("Coupon", CouponSchema);
