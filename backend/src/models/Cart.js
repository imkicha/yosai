import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  variantId: { type: mongoose.Schema.Types.ObjectId },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  name: String,
  image: String,
  price: Number,
  mrp: Number,
  selectedSize: String,
  selectedColor: String,
  quantity: { type: Number, default: 1, min: 1 },
});

const CartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    cartId: { type: String, unique: true, required: true }, // guest cart
    items: [CartItemSchema],
  },
  { timestamps: true }
);

const Cart = mongoose.models.Cart || mongoose.model("Cart", CartSchema);
export default Cart;
