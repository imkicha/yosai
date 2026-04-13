import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema({
  color: { type: String, trim: true },
  size: [String],
  price: { type: Number, required: true, min: 0 },
  mrp: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0, default: 0 },
  sku: { type: String },
  images: [String],
}, { _id: true, timestamps: true });

const ProductSchema = new mongoose.Schema(
  {
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, sparse: true },
    description: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    images: [String],
    featured: { type: Boolean, default: false },
    variants: [VariantSchema],
    tags: [String],
    shippingInfo: {
      weight: Number,
      length: Number,
      breadth: Number,
      height: Number,
    },
    warrantyInfo: { type: String, default: "No warranty" },
    returnPolicy: { type: String, default: "7 day return policy" },
    status: {
      type: String,
      enum: ["draft", "pending_approval", "approved", "rejected", "archived"],
      default: "pending_approval",
    },
    adminNote: { type: String },
    totalSold: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default Product;
