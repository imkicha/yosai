import mongoose from "mongoose";

const DocumentMasterSchema = new mongoose.Schema(
  {
    documentName: { type: String, required: true },
    documentCode: { type: String, required: true, unique: true, uppercase: true },
    documentType: { type: String, enum: ["image", "pdf", "text"], default: "image" },
    isRequired: { type: Boolean, default: true },
    applicableRoles: [{ type: String, enum: ["vendor", "customer"] }],
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const VendorDocumentSchema = new mongoose.Schema(
  {
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true, index: true },
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: "DocumentMaster", required: true },
    fileName: { type: String },
    fileUrl: { type: String, required: true },
    identificationNumber: { type: String },
    verificationStatus: {
      type: String,
      enum: ["submitted", "pending", "verified", "approved", "rejected"],
      default: "submitted",
    },
    adminComment: { type: String },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    verifiedAt: { type: Date },
  },
  { timestamps: true }
);

export const VendorDocument = mongoose.model("VendorDocument", VendorDocumentSchema);
export default mongoose.model("DocumentMaster", DocumentMasterSchema);
