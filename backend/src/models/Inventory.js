import mongoose from "mongoose";

const InventoryLogSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    variantId: { type: mongoose.Schema.Types.ObjectId, required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true, index: true },
    type: { type: String, enum: ["addition", "deduction", "adjustment"], required: true },
    quantity: { type: Number, required: true },
    previousStock: { type: Number, required: true },
    newStock: { type: Number, required: true },
    reason: { type: String, enum: ["manual", "order_placed", "order_cancelled", "return", "restock", "correction"], default: "manual" },
    note: { type: String },
    referenceId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("InventoryLog", InventoryLogSchema);
