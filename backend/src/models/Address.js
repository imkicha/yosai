import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    locality: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: "India" },
    type: { type: String, enum: ["home", "work", "other"], default: "home" },
    isPrimary: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Address = mongoose.models.Address || mongoose.model("Address", AddressSchema);
export default Address;
