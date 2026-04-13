import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "order_placed", "order_confirmed", "order_shipped", "order_delivered",
        "order_cancelled", "order_delayed", "product_approved", "product_rejected",
        "payout_processed", "refund_credited", "low_stock", "new_message", "kyc_update",
      ],
      required: true,
    },
    referenceId: { type: String },
    referenceModel: { type: String },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
export default Notification;
