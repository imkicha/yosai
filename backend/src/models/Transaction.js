import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    walletId: { type: mongoose.Schema.Types.ObjectId, ref: "Wallet", required: true },
    type: { type: String, enum: ["credit", "debit"], required: true },
    amount: { type: Number, required: true },
    reason: {
      type: String,
      enum: ["order_earning", "refund", "payout", "wallet_use", "commission", "manual"],
      required: true,
    },
    referenceId: { type: String },
    note: { type: String },
    balanceAfter: { type: Number },
  },
  { timestamps: true }
);

const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);
export default Transaction;
