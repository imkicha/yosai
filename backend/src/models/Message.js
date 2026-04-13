import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    conversationId: { type: String, required: true, index: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    senderRole: { type: String, enum: ["customer", "vendor", "admin"], required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiverRole: { type: String, enum: ["customer", "vendor", "admin"] },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Message = mongoose.models.Message || mongoose.model("Message", MessageSchema);
export default Message;
