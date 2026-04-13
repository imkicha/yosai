import mongoose from "mongoose";

const VendorBankDetailSchema = new mongoose.Schema(
  {
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true, index: true },
    bankName: { type: String, required: true, trim: true },
    accountHolderName: { type: String, required: true, trim: true },
    accountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true, uppercase: true },
    accountType: { type: String, enum: ["savings", "current"], default: "savings" },
    isPrimary: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("VendorBankDetail", VendorBankDetailSchema);
