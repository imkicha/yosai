import mongoose from "mongoose";

const VendorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    brandName: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, sparse: true },
    description: { type: String },
    logo: { type: String, default: null },
    phone: { type: String },
    email: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "pending",
    },
    adminNote: { type: String, default: null },
    kyc: {
      gstNumber: { type: String },
      panNumber: { type: String },
      bankAccount: { type: String },
      ifscCode: { type: String },
      bankName: { type: String },
      accountHolderName: { type: String },
      documents: [
        {
          label: String,
          url: String,
          status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
          uploadedAt: { type: Date, default: Date.now },
        },
      ],
      verified: { type: Boolean, default: false },
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: "India" },
    },
    shiprocket: {
      pickupLocationId: { type: String, default: null },
      pickupLocationName: { type: String, default: null },
    },
    wallet: { type: mongoose.Schema.Types.ObjectId, ref: "Wallet", default: null },
    commissionOverride: { type: mongoose.Schema.Types.ObjectId, ref: "Commission", default: null },
    totalRevenue: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
  },
  { timestamps: true }
);

const Vendor = mongoose.models.Vendor || mongoose.model("Vendor", VendorSchema);
export default Vendor;
