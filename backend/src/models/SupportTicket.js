import mongoose from "mongoose";

const ReplySchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  senderRole: { type: String, enum: ["customer", "vendor", "admin"], required: true },
  message: { type: String, required: true },
  attachment: { type: String },
}, { timestamps: true });

const SupportTicketSchema = new mongoose.Schema(
  {
    ticketNumber: { type: String, unique: true, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    orderId: { type: String, default: null },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["order", "payment", "product", "shipping", "refund", "account", "other"],
      default: "other",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },
    attachment: { type: String },
    replies: [ReplySchema],
    resolvedAt: { type: Date },
    closedAt: { type: Date },
  },
  { timestamps: true }
);

SupportTicketSchema.pre("validate", function (next) {
  if (!this.ticketNumber) {
    this.ticketNumber = `TKT-${Date.now().toString(36).toUpperCase()}`;
  }
  next();
});

export default mongoose.model("SupportTicket", SupportTicketSchema);
