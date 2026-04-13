import mongoose from "mongoose";

const WalletSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    ownerType: { type: String, enum: ["customer", "vendor"], required: true },
    balance: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: "INR" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Wallet = mongoose.models.Wallet || mongoose.model("Wallet", WalletSchema);
export default Wallet;
