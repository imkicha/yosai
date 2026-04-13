import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String },
    icon: { type: String },
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null, index: true },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    commissionPercent: { type: Number, default: null },
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  { timestamps: true }
);

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
export default Category;
