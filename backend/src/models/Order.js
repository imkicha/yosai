import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  name: String,
  phone: String,
  street: String,
  locality: String,
  city: String,
  state: String,
  pincode: String,
  country: { type: String, default: "India" },
});

const SubOrderSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  subOrderId: { type: String, required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      variantId: mongoose.Schema.Types.ObjectId,
      name: String,
      image: String,
      price: Number,
      mrp: Number,
      quantity: Number,
      selectedSize: String,
      selectedColor: String,
    },
  ],
  subtotal: { type: Number, required: true },
  commission: {
    rate: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
  },
  vendorEarning: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled", "returned"],
    default: "pending",
  },
  statusHistory: [{ status: String, note: String, date: { type: Date, default: Date.now } }],
  shipping: {
    shiprocketOrderId: String,
    shipmentId: String,
    awbCode: String,
    trackingUrl: String,
    courier: String,
    shipmentStatus: String,
    shippedAt: Date,
    deliveredAt: Date,
  },
  payoutStatus: { type: String, enum: ["pending", "processing", "paid"], default: "pending" },
  payoutId: { type: String, default: null },
  isDelayed: { type: Boolean, default: false },
  delayAlertSent: { type: Boolean, default: false },
});

const OrderSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderId: { type: String, unique: true, required: true },
    payment: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
      method: String,
      status: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
      amount: Number,
      currency: { type: String, default: "INR" },
      paidAt: Date,
    },
    shippingAddress: AddressSchema,
    subOrders: [SubOrderSchema],
    totalAmount: Number,
    totalMRP: Number,
    discount: { type: Number, default: 0 },
    walletAmountUsed: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "partially_shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
export default Order;
