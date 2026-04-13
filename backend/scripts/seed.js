/**
 * Yosai Platform — Full Seed Script
 * Creates dummy data for ALL features: users, vendors, products, orders,
 * wallets, transactions, coupons, support tickets, notifications, etc.
 *
 * Usage:
 *   cd d:/yosai-platform/backend
 *   node scripts/seed.js
 *
 * Options:
 *   --fresh    Drop all collections before seeding (DESTRUCTIVE)
 *
 * Credentials:
 *   Admin    → admin@yosai.com       / Admin@123
 *   Vendor1  → vendor@yosai.com      / Vendor@123
 *   Vendor2  → vendor2@yosai.com     / Vendor@123
 *   Customer → customer@yosai.com    / Customer@123
 *   Customer → customer2@yosai.com   / Customer@123
 */

import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

const isFresh = process.argv.includes("--fresh");

// ── Cloudinary Setup ──────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (imageUrl, folder, publicId) => {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: `yosai/${folder}`,
      public_id: publicId,
      overwrite: false,
      resource_type: "image",
    });
    return result.secure_url;
  } catch (err) {
    // If already exists, build the URL
    if (err?.error?.message?.includes("already exists")) {
      return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/yosai/${folder}/${publicId}`;
    }
    console.warn(`    ⚠ Upload failed for ${publicId}: ${err.message || err}`);
    return imageUrl; // fallback to original URL
  }
};

// ── Helper ────────────────────────────────────────────────────────────────────
const oid = () => new mongoose.Types.ObjectId();
const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const genOrderId = (i) => `YOS-${String(100000 + i)}`;
const genSubOrderId = (ordI, subI) => `YOS-${String(100000 + ordI)}-V${subI + 1}`;
const genTicketNum = (i) => `TKT-${String(Date.now().toString(36)).toUpperCase()}${i}`;
const daysAgo = (n) => new Date(Date.now() - n * 86400000);

// ── Inline Schemas (avoid circular dep) ───────────────────────────────────────

// User
const UserAddressSchema = new mongoose.Schema({
  label: String, name: String, phone: String, street: String,
  city: String, state: String, pincode: String, country: { type: String, default: "India" },
  isDefault: { type: Boolean, default: false },
}, { _id: true });

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: String,
  password: String,
  role: { type: String, enum: ["customer", "vendor", "admin"], default: "customer" },
  avatar: String,
  isActive: { type: Boolean, default: true },
  authProvider: { type: String, default: "credentials" },
  lastLogin: Date,
  addresses: [UserAddressSchema],
}, { timestamps: true });

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

// Wallet
const WalletSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  ownerType: { type: String, enum: ["customer", "vendor"], required: true },
  balance: { type: Number, default: 0 },
  currency: { type: String, default: "INR" },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
const Wallet = mongoose.models.Wallet || mongoose.model("Wallet", WalletSchema);

// Transaction
const TransactionSchema = new mongoose.Schema({
  walletId: { type: mongoose.Schema.Types.ObjectId, ref: "Wallet", required: true },
  type: { type: String, enum: ["credit", "debit"], required: true },
  amount: { type: Number, required: true },
  reason: { type: String, enum: ["order_earning", "refund", "payout", "wallet_use", "commission", "manual"], required: true },
  referenceId: String,
  note: String,
  balanceAfter: Number,
}, { timestamps: true });
const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);

// Vendor
const VendorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  brandName: { type: String, required: true },
  slug: { type: String, unique: true, sparse: true },
  description: String,
  logo: String,
  phone: String,
  email: String,
  status: { type: String, enum: ["pending", "approved", "rejected", "suspended"], default: "pending" },
  adminNote: String,
  kyc: {
    gstNumber: String, panNumber: String, bankAccount: String, ifscCode: String,
    bankName: String, accountHolderName: String,
    documents: [{ label: String, url: String, status: { type: String, default: "pending" }, uploadedAt: { type: Date, default: Date.now } }],
    verified: { type: Boolean, default: false },
  },
  address: { street: String, city: String, state: String, pincode: String, country: { type: String, default: "India" } },
  shiprocket: { pickupLocationId: String, pickupLocationName: String },
  wallet: { type: mongoose.Schema.Types.ObjectId, ref: "Wallet" },
  commissionOverride: { type: mongoose.Schema.Types.ObjectId, ref: "Commission" },
  totalRevenue: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  lowStockThreshold: { type: Number, default: 5 },
}, { timestamps: true });
const Vendor = mongoose.models.Vendor || mongoose.model("Vendor", VendorSchema);

// Category
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true }, slug: { type: String, required: true, unique: true },
  description: String, image: String, icon: String,
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
  isActive: { type: Boolean, default: true }, isFeatured: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 }, commissionPercent: Number,
  seoTitle: String, seoDescription: String,
}, { timestamps: true });
const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);

// Product
const VariantSchema = new mongoose.Schema({
  color: String, size: [String], price: Number, mrp: Number,
  stock: { type: Number, default: 0 }, sku: String, images: [String],
}, { _id: true, timestamps: true });
const ProductSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  name: { type: String, required: true }, slug: { type: String, unique: true, sparse: true },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  images: [String], featured: { type: Boolean, default: false },
  variants: [VariantSchema], tags: [String],
  shippingInfo: { weight: Number, length: Number, breadth: Number, height: Number },
  warrantyInfo: String, returnPolicy: String,
  status: { type: String, enum: ["draft", "pending_approval", "approved", "rejected", "archived"], default: "pending_approval" },
  adminNote: String, totalSold: { type: Number, default: 0 },
  rating: { type: Number, default: 0 }, reviewCount: { type: Number, default: 0 },
}, { timestamps: true });
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

// Order
const OrderAddressSchema = new mongoose.Schema({
  name: String, phone: String, street: String, locality: String,
  city: String, state: String, pincode: String, country: { type: String, default: "India" },
});
const SubOrderSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  subOrderId: { type: String, required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    variantId: mongoose.Schema.Types.ObjectId, name: String, image: String,
    price: Number, mrp: Number, quantity: Number, selectedSize: String, selectedColor: String,
  }],
  subtotal: Number,
  commission: { rate: { type: Number, default: 0 }, amount: { type: Number, default: 0 } },
  vendorEarning: Number,
  status: { type: String, enum: ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled", "returned"], default: "pending" },
  statusHistory: [{ status: String, note: String, date: { type: Date, default: Date.now } }],
  shipping: { shiprocketOrderId: String, shipmentId: String, awbCode: String, trackingUrl: String, courier: String, shipmentStatus: String, shippedAt: Date, deliveredAt: Date },
  payoutStatus: { type: String, enum: ["pending", "processing", "paid"], default: "pending" },
  payoutId: String, isDelayed: { type: Boolean, default: false }, delayAlertSent: { type: Boolean, default: false },
});
const OrderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderId: { type: String, unique: true, required: true },
  payment: {
    razorpayOrderId: String, razorpayPaymentId: String, razorpaySignature: String,
    method: String, status: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
    amount: Number, currency: { type: String, default: "INR" }, paidAt: Date,
  },
  shippingAddress: OrderAddressSchema,
  subOrders: [SubOrderSchema],
  totalAmount: Number, totalMRP: Number, discount: { type: Number, default: 0 },
  walletAmountUsed: { type: Number, default: 0 },
  status: { type: String, enum: ["pending", "confirmed", "partially_shipped", "delivered", "cancelled"], default: "pending" },
}, { timestamps: true });
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

// Cart
const CartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  variantId: mongoose.Schema.Types.ObjectId,
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  name: String, image: String, price: Number, mrp: Number,
  selectedSize: String, selectedColor: String,
  quantity: { type: Number, default: 1 },
});
const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  cartId: { type: String, unique: true, required: true },
  items: [CartItemSchema],
}, { timestamps: true });
const Cart = mongoose.models.Cart || mongoose.model("Cart", CartSchema);

// Commission
const CommissionSchema = new mongoose.Schema({
  label: { type: String, required: true },
  slabs: [{ minAmount: Number, maxAmount: Number, rate: Number }],
  isDefault: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  appliedTo: { type: String, enum: ["global", "vendor"], default: "global" },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
}, { timestamps: true });
const Commission = mongoose.models.Commission || mongoose.model("Commission", CommissionSchema);

// Coupon
const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  description: String,
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
  discountType: { type: String, enum: ["flat", "percentage"], required: true },
  discountValue: { type: Number, required: true },
  minPurchaseAmount: { type: Number, default: 0 },
  maxDiscountAmount: Number,
  validFrom: Date, validTill: Date,
  maxUsageLimit: Number, maxUsagePerCustomer: { type: Number, default: 1 },
  usedCount: { type: Number, default: 0 },
  applicableCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);

// Support Ticket
const ReplySchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  senderRole: { type: String, enum: ["customer", "vendor", "admin"], required: true },
  message: { type: String, required: true },
  attachment: String,
}, { timestamps: true });
const SupportTicketSchema = new mongoose.Schema({
  ticketNumber: { type: String, unique: true, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orderId: String,
  subject: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ["order", "payment", "product", "shipping", "refund", "account", "other"], default: "other" },
  priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium" },
  status: { type: String, enum: ["open", "in_progress", "resolved", "closed"], default: "open" },
  attachment: String,
  replies: [ReplySchema],
  resolvedAt: Date, closedAt: Date,
}, { timestamps: true });
const SupportTicket = mongoose.models.SupportTicket || mongoose.model("SupportTicket", SupportTicketSchema);

// Notification
const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: [
    "order_placed", "order_confirmed", "order_shipped", "order_delivered",
    "order_cancelled", "order_delayed", "product_approved", "product_rejected",
    "payout_processed", "refund_credited", "low_stock", "new_message", "kyc_update",
  ], required: true },
  referenceId: String, referenceModel: String,
  isRead: { type: Boolean, default: false },
}, { timestamps: true });
const Notification = mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);

// Payout Request
const PayoutRequestSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  amount: { type: Number, required: true, min: 1 },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  transactionRef: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
  note: String, adminNote: String,
  processedAt: Date,
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
const PayoutRequest = mongoose.models.PayoutRequest || mongoose.model("PayoutRequest", PayoutRequestSchema);

// Vendor Bank Detail
const VendorBankDetailSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  bankName: { type: String, required: true },
  accountHolderName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  ifscCode: { type: String, required: true, uppercase: true },
  accountType: { type: String, enum: ["savings", "current"], default: "savings" },
  isPrimary: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  status: { type: Boolean, default: true },
}, { timestamps: true });
const VendorBankDetail = mongoose.models.VendorBankDetail || mongoose.model("VendorBankDetail", VendorBankDetailSchema);

// Document Master + Vendor Document
const DocumentMasterSchema = new mongoose.Schema({
  documentName: { type: String, required: true },
  documentCode: { type: String, required: true, unique: true, uppercase: true },
  documentType: { type: String, enum: ["image", "pdf", "text"], default: "image" },
  isRequired: { type: Boolean, default: true },
  applicableRoles: [{ type: String, enum: ["vendor", "customer"] }],
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });
const DocumentMaster = mongoose.models.DocumentMaster || mongoose.model("DocumentMaster", DocumentMasterSchema);

const VendorDocumentSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: "DocumentMaster", required: true },
  fileName: String, fileUrl: { type: String, required: true },
  identificationNumber: String,
  verificationStatus: { type: String, enum: ["submitted", "pending", "verified", "approved", "rejected"], default: "submitted" },
  adminComment: String,
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  verifiedAt: Date,
}, { timestamps: true });
const VendorDocument = mongoose.models.VendorDocument || mongoose.model("VendorDocument", VendorDocumentSchema);

// Inventory Log
const InventoryLogSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  variantId: { type: mongoose.Schema.Types.ObjectId, required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  type: { type: String, enum: ["addition", "deduction", "adjustment"], required: true },
  quantity: Number, previousStock: Number, newStock: Number,
  reason: { type: String, enum: ["manual", "order_placed", "order_cancelled", "return", "restock", "correction"], default: "manual" },
  note: String, referenceId: String,
}, { timestamps: true });
const InventoryLog = mongoose.models.InventoryLog || mongoose.model("InventoryLog", InventoryLogSchema);

// Message
const MessageSchema = new mongoose.Schema({
  conversationId: { type: String, required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  senderRole: { type: String, enum: ["customer", "vendor", "admin"], required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiverRole: { type: String, enum: ["customer", "vendor", "admin"] },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });
const Message = mongoose.models.Message || mongoose.model("Message", MessageSchema);

// ── Seed Data ─────────────────────────────────────────────────────────────────

const USERS = [
  { name: "Yosai Admin", email: "admin@yosai.com", phone: "9000000001", password: "Admin@123", role: "admin" },
  {
    name: "Priya Sharma", email: "vendor@yosai.com", phone: "9000000002", password: "Vendor@123", role: "vendor",
  },
  {
    name: "Ravi Textiles", email: "vendor2@yosai.com", phone: "9000000005", password: "Vendor@123", role: "vendor",
  },
  {
    name: "Anandhi Kumar", email: "customer@yosai.com", phone: "9000000003", password: "Customer@123", role: "customer",
    addresses: [
      { label: "Home", name: "Anandhi Kumar", phone: "9000000003", street: "12, Anna Nagar Main Road", city: "Chennai", state: "Tamil Nadu", pincode: "600040", isDefault: true },
      { label: "Work", name: "Anandhi Kumar", phone: "9000000003", street: "56, Guindy Industrial Estate", city: "Chennai", state: "Tamil Nadu", pincode: "600032", isDefault: false },
    ],
  },
  {
    name: "Meena Devi", email: "customer2@yosai.com", phone: "9000000004", password: "Customer@123", role: "customer",
    addresses: [
      { label: "Home", name: "Meena Devi", phone: "9000000004", street: "78, MG Road", city: "Bangalore", state: "Karnataka", pincode: "560001", isDefault: true },
    ],
  },
];

const CATEGORIES = [
  { name: "Blouses", slug: "blouses", description: "Designer blouses", isFeatured: true, sortOrder: 1 },
  { name: "Sarees", slug: "sarees", description: "Traditional and modern sarees", isFeatured: true, sortOrder: 2 },
  { name: "Lehengas", slug: "lehengas", description: "Bridal and party lehengas", isFeatured: true, sortOrder: 3 },
  { name: "Kurtis", slug: "kurtis", description: "Casual and formal kurtis", isFeatured: true, sortOrder: 4 },
  { name: "Anarkali", slug: "anarkali", description: "Anarkali suits", sortOrder: 5 },
  { name: "Salwar Suits", slug: "salwar-suits", description: "Salwar kameez sets", sortOrder: 6 },
  { name: "Dupattas", slug: "dupattas", description: "Dupattas and stoles", sortOrder: 7 },
  { name: "Accessories", slug: "accessories", description: "Fashion accessories", sortOrder: 8 },
];

const DOCUMENT_MASTERS = [
  { documentName: "PAN Card", documentCode: "PAN", documentType: "image", isRequired: true, applicableRoles: ["vendor"], sortOrder: 1 },
  { documentName: "GST Certificate", documentCode: "GST", documentType: "pdf", isRequired: true, applicableRoles: ["vendor"], sortOrder: 2 },
  { documentName: "Aadhaar Card", documentCode: "AADHAAR", documentType: "image", isRequired: true, applicableRoles: ["vendor"], sortOrder: 3 },
  { documentName: "Bank Passbook / Cancelled Cheque", documentCode: "BANK_PROOF", documentType: "image", isRequired: true, applicableRoles: ["vendor"], sortOrder: 4 },
  { documentName: "Business Registration", documentCode: "BIZ_REG", documentType: "pdf", isRequired: false, applicableRoles: ["vendor"], sortOrder: 5 },
  { documentName: "Address Proof", documentCode: "ADDR_PROOF", documentType: "image", isRequired: false, applicableRoles: ["vendor"], sortOrder: 6 },
];

// ── Main Seed ─────────────────────────────────────────────────────────────────

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✓ Connected to MongoDB\n");

    if (isFresh) {
      console.log("⚠ --fresh flag detected: Dropping all collections...\n");
      const collections = await mongoose.connection.db.listCollections().toArray();
      for (const col of collections) {
        await mongoose.connection.db.dropCollection(col.name);
        console.log(`  ✗ Dropped: ${col.name}`);
      }
      console.log("");
    }

    // ════════════════════════════════════════════════════════════════════════
    // 1. USERS
    // ════════════════════════════════════════════════════════════════════════
    console.log("── 1. Creating Users ─────────────────────────────────────");
    const users = {};
    for (const ud of USERS) {
      let user = await User.findOne({ email: ud.email });
      if (user) {
        console.log(`  ⚠ Exists: ${ud.email}`);
      } else {
        user = await new User(ud).save();
        console.log(`  ✓ Created: ${ud.email} (${ud.role}) — password: ${ud.password}`);
      }
      if (!users[ud.role]) users[ud.role] = [];
      users[ud.role].push(user);
    }

    const adminUser = users.admin[0];
    const vendorUsers = users.vendor || [];
    const customerUsers = users.customer || [];

    // ════════════════════════════════════════════════════════════════════════
    // 2. CATEGORIES
    // ════════════════════════════════════════════════════════════════════════
    console.log("\n── 2. Creating Categories ────────────────────────────────");
    const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY;

    // Category source images (generic fashion/textile images)
    const CATEGORY_IMAGES = {
      blouses: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=300&fit=crop",
      sarees: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=300&h=300&fit=crop",
      lehengas: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=300&fit=crop",
      kurtis: "https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=300&h=300&fit=crop",
      anarkali: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=300&h=300&fit=crop",
      "salwar-suits": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=300&h=300&fit=crop",
      dupattas: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=300&h=300&fit=crop",
      accessories: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=300&fit=crop",
    };

    const categories = [];
    for (const cd of CATEGORIES) {
      let cat = await Category.findOne({ slug: cd.slug });
      if (!cat) {
        // Upload category image
        const sourceImg = CATEGORY_IMAGES[cd.slug];
        if (sourceImg && hasCloudinary) {
          cd.image = await uploadToCloudinary(sourceImg, "categories", cd.slug);
        } else if (sourceImg) {
          cd.image = sourceImg;
        }
        cat = await Category.create(cd);
        process.stdout.write(`  ✓ ${cd.name}  `);
      } else {
        process.stdout.write(`  ⚠ ${cd.name}  `);
      }
      categories.push(cat);
    }
    console.log("");

    // ════════════════════════════════════════════════════════════════════════
    // 3. COMMISSION CONFIG
    // ════════════════════════════════════════════════════════════════════════
    console.log("\n── 3. Creating Commission Config ─────────────────────────");
    let globalCommission = await Commission.findOne({ isDefault: true });
    if (!globalCommission) {
      globalCommission = await Commission.create({
        label: "Standard Commission",
        isDefault: true, isActive: true, appliedTo: "global",
        slabs: [
          { minAmount: 0, maxAmount: 500, rate: 8 },
          { minAmount: 501, maxAmount: 2000, rate: 10 },
          { minAmount: 2001, maxAmount: 5000, rate: 12 },
          { minAmount: 5001, maxAmount: null, rate: 15 },
        ],
      });
      console.log("  ✓ Global commission: 8%/10%/12%/15% slabs");
    } else {
      console.log("  ⚠ Global commission already exists");
    }

    // ════════════════════════════════════════════════════════════════════════
    // 4. DOCUMENT MASTERS
    // ════════════════════════════════════════════════════════════════════════
    console.log("\n── 4. Creating Document Masters ──────────────────────────");
    const docMasters = [];
    for (const dm of DOCUMENT_MASTERS) {
      let doc = await DocumentMaster.findOne({ documentCode: dm.documentCode });
      if (!doc) {
        doc = await DocumentMaster.create(dm);
        process.stdout.write(`  ✓ ${dm.documentName}  `);
      } else {
        process.stdout.write(`  ⚠ ${dm.documentName}  `);
      }
      docMasters.push(doc);
    }
    console.log("");

    // ════════════════════════════════════════════════════════════════════════
    // 5. VENDORS + WALLETS + BANK DETAILS + VENDOR DOCUMENTS
    // ════════════════════════════════════════════════════════════════════════
    console.log("\n── 5. Creating Vendors, Wallets, Bank Details ────────────");

    const vendorData = [
      {
        userId: vendorUsers[0]?._id,
        brandName: "Priya Boutique", slug: "priya-boutique",
        description: "Premium designer blouses and sarees from Chennai",
        phone: "9000000002", email: "vendor@yosai.com",
        status: "approved",
        kyc: {
          gstNumber: "33AABCT1332L1ZU", panNumber: "AABCT1332L",
          bankAccount: "31234567890", ifscCode: "SBIN0001234",
          bankName: "State Bank of India", accountHolderName: "Priya Sharma",
          verified: true,
        },
        address: { street: "45, T Nagar", city: "Chennai", state: "Tamil Nadu", pincode: "600017" },
        shiprocket: { pickupLocationId: "123456", pickupLocationName: "Priya Boutique - Chennai" },
        totalRevenue: 45600, totalOrders: 18,
      },
      {
        userId: vendorUsers[1]?._id,
        brandName: "Ravi Textiles", slug: "ravi-textiles",
        description: "Traditional handloom sarees and kurtis",
        phone: "9000000005", email: "vendor2@yosai.com",
        status: "approved",
        kyc: {
          gstNumber: "29AADCR5678M1ZK", panNumber: "AADCR5678M",
          bankAccount: "50100456789", ifscCode: "HDFC0001234",
          bankName: "HDFC Bank", accountHolderName: "Ravi Kumar",
          verified: true,
        },
        address: { street: "12, Chickpet", city: "Bangalore", state: "Karnataka", pincode: "560053" },
        shiprocket: { pickupLocationId: "789012", pickupLocationName: "Ravi Textiles - Bangalore" },
        totalRevenue: 32400, totalOrders: 12,
      },
    ];

    const vendors = [];
    const vendorWallets = [];
    for (let i = 0; i < vendorData.length; i++) {
      const vd = vendorData[i];
      if (!vd.userId) continue;
      let vendor = await Vendor.findOne({ userId: vd.userId });
      if (!vendor) {
        // Create wallet first
        const wallet = await Wallet.create({ ownerId: oid(), ownerType: "vendor", balance: 2500 + i * 1500 });
        vd.wallet = wallet._id;
        vendor = await Vendor.create(vd);
        // Update wallet ownerId to vendor._id
        wallet.ownerId = vendor._id;
        await wallet.save();
        vendorWallets.push(wallet);
        console.log(`  ✓ Vendor: ${vd.brandName} (approved) — wallet: ₹${wallet.balance}`);
      } else {
        const wallet = await Wallet.findOne({ ownerId: vendor._id, ownerType: "vendor" });
        vendorWallets.push(wallet);
        console.log(`  ⚠ Vendor exists: ${vendor.brandName}`);
      }
      vendors.push(vendor);
    }

    // Bank details
    for (let i = 0; i < vendors.length; i++) {
      const v = vendors[i];
      const existing = await VendorBankDetail.findOne({ vendorId: v._id });
      if (!existing) {
        await VendorBankDetail.create({
          vendorId: v._id,
          bankName: v.kyc?.bankName || "SBI",
          accountHolderName: v.kyc?.accountHolderName || v.brandName,
          accountNumber: v.kyc?.bankAccount || "31234567890",
          ifscCode: v.kyc?.ifscCode || "SBIN0001234",
          accountType: "current",
          isPrimary: true,
          isVerified: true,
        });
        console.log(`  ✓ Bank detail for ${v.brandName}`);
      }
    }

    // Vendor documents
    for (const v of vendors) {
      const existingDocs = await VendorDocument.countDocuments({ vendorId: v._id });
      if (existingDocs === 0) {
        for (const dm of docMasters.slice(0, 4)) { // first 4 required docs
          await VendorDocument.create({
            vendorId: v._id,
            documentId: dm._id,
            fileName: `${dm.documentCode.toLowerCase()}_${v.slug}.jpg`,
            fileUrl: hasCloudinary
              ? await uploadToCloudinary(`https://placehold.co/600x400/f9a8d4/be185d?text=${dm.documentCode}`, "documents", `${dm.documentCode.toLowerCase()}_${v.slug}`)
              : `https://placehold.co/600x400/f9a8d4/be185d?text=${dm.documentCode}`,
            identificationNumber: dm.documentCode === "PAN" ? v.kyc?.panNumber : dm.documentCode === "GST" ? v.kyc?.gstNumber : "XXXX-XXXX-XXXX",
            verificationStatus: "approved",
            verifiedBy: adminUser._id,
            verifiedAt: daysAgo(15),
          });
        }
        console.log(`  ✓ 4 documents uploaded for ${v.brandName}`);
      }
    }

    // Vendor-specific commission override for vendor 1
    let vendorCommission = await Commission.findOne({ vendorId: vendors[0]?._id, appliedTo: "vendor" });
    if (!vendorCommission && vendors[0]) {
      vendorCommission = await Commission.create({
        label: `${vendors[0].brandName} Override`,
        isDefault: false, isActive: true, appliedTo: "vendor",
        vendorId: vendors[0]._id,
        slabs: [{ minAmount: 0, maxAmount: null, rate: 7 }],
      });
      await Vendor.findByIdAndUpdate(vendors[0]._id, { commissionOverride: vendorCommission._id });
      console.log(`  ✓ Commission override for ${vendors[0].brandName}: flat 7%`);
    }

    // ════════════════════════════════════════════════════════════════════════
    // 6. CUSTOMER WALLETS
    // ════════════════════════════════════════════════════════════════════════
    console.log("\n── 6. Creating Customer Wallets ───────────────────────────");
    const customerWallets = [];
    for (const cu of customerUsers) {
      let wallet = await Wallet.findOne({ ownerId: cu._id, ownerType: "customer" });
      if (!wallet) {
        wallet = await Wallet.create({ ownerId: cu._id, ownerType: "customer", balance: 500 });
        console.log(`  ✓ Wallet for ${cu.name}: ₹500`);
      } else {
        console.log(`  ⚠ Wallet exists for ${cu.name}: ₹${wallet.balance}`);
      }
      customerWallets.push(wallet);
    }

    // ════════════════════════════════════════════════════════════════════════
    // 7. PRODUCTS
    // ════════════════════════════════════════════════════════════════════════
    console.log("\n── 7. Creating Products (uploading images to Cloudinary) ──");

    // Source images (public URLs for Indian fashion products)
    const SOURCE_IMAGES = {
      blouse1: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop",
      blouse2: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&h=800&fit=crop",
      saree1: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop",
      saree2: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&h=800&fit=crop",
      lehenga1: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop",
      lehenga2: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&h=800&fit=crop",
      dupatta1: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&h=800&fit=crop",
      kurti1: "https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=600&h=800&fit=crop",
      kurti2: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&h=800&fit=crop",
      salwar1: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&h=800&fit=crop",
      anarkali1: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop",
      jewelry1: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=800&fit=crop",
      velvet1: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&h=800&fit=crop",
      chanderi1: "https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=600&h=800&fit=crop",
    };

    // Upload all images to Cloudinary first
    const uploadedImages = {};

    if (hasCloudinary) {
      console.log("  ☁ Cloudinary configured — uploading images...");
      for (const [key, url] of Object.entries(SOURCE_IMAGES)) {
        uploadedImages[key] = await uploadToCloudinary(url, "products", key);
        process.stdout.write(`    ✓ ${key}  `);
      }
      console.log("\n");
    } else {
      console.log("  ⚠ Cloudinary not configured — using source URLs directly");
      console.log("    Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env\n");
      Object.assign(uploadedImages, SOURCE_IMAGES);
    }

    const img = (key) => uploadedImages[key] || SOURCE_IMAGES[key];

    const PRODUCT_DATA = [
      // Vendor 1 products
      {
        vendorIdx: 0, catSlug: "blouses",
        name: "Silk Embroidered Blouse", slug: "silk-embroidered-blouse",
        description: "Elegant silk blouse with intricate zari embroidery. Perfect for weddings and festive occasions.",
        images: [img("blouse1"), img("blouse2")],
        featured: true, tags: ["silk", "embroidery", "wedding", "festive"],
        shippingInfo: { weight: 200, length: 30, breadth: 25, height: 5 },
        status: "approved", totalSold: 45, rating: 4.5, reviewCount: 12,
        variants: [
          { color: "Red", size: ["S", "M", "L", "XL"], price: 1299, mrp: 1799, stock: 25, sku: "SEB-RED-001", images: [img("blouse1")] },
          { color: "Gold", size: ["S", "M", "L"], price: 1399, mrp: 1899, stock: 18, sku: "SEB-GLD-001", images: [img("blouse2")] },
          { color: "Navy Blue", size: ["M", "L", "XL"], price: 1299, mrp: 1799, stock: 3, sku: "SEB-NVY-001", images: [img("blouse1")] },
        ],
      },
      {
        vendorIdx: 0, catSlug: "sarees",
        name: "Kanchipuram Silk Saree", slug: "kanchipuram-silk-saree",
        description: "Authentic Kanchipuram silk saree with gold zari border. A timeless classic for special occasions.",
        images: [img("saree1"), img("saree2")],
        featured: true, tags: ["kanchipuram", "silk", "traditional", "wedding"],
        shippingInfo: { weight: 800, length: 35, breadth: 30, height: 10 },
        status: "approved", totalSold: 28, rating: 4.8, reviewCount: 8,
        variants: [
          { color: "Maroon", size: ["Free Size"], price: 4999, mrp: 6999, stock: 10, sku: "KSS-MRN-001", images: [img("saree1")] },
          { color: "Green", size: ["Free Size"], price: 5299, mrp: 7299, stock: 7, sku: "KSS-GRN-001", images: [img("saree2")] },
        ],
      },
      {
        vendorIdx: 0, catSlug: "lehengas",
        name: "Bridal Lehenga Set", slug: "bridal-lehenga-set",
        description: "Heavy bridal lehenga with choli and dupatta. Gorgeous mirror work and thread embroidery.",
        images: [img("lehenga1"), img("lehenga2")],
        featured: true, tags: ["bridal", "lehenga", "heavy", "mirror-work"],
        shippingInfo: { weight: 2500, length: 40, breadth: 35, height: 15 },
        status: "approved", totalSold: 5, rating: 4.9, reviewCount: 3,
        variants: [
          { color: "Red", size: ["S", "M", "L"], price: 12999, mrp: 18999, stock: 4, sku: "BLS-RED-001", images: [img("lehenga1")] },
          { color: "Pink", size: ["S", "M", "L"], price: 12999, mrp: 18999, stock: 6, sku: "BLS-PNK-001", images: [img("lehenga2")] },
        ],
      },
      {
        vendorIdx: 0, catSlug: "dupattas",
        name: "Banarasi Dupatta", slug: "banarasi-dupatta",
        description: "Handwoven Banarasi silk dupatta with golden zari work.",
        images: [img("dupatta1")],
        tags: ["banarasi", "silk", "dupatta"],
        shippingInfo: { weight: 300, length: 30, breadth: 25, height: 5 },
        status: "approved", totalSold: 60, rating: 4.3, reviewCount: 20,
        variants: [
          { color: "Pink", size: ["Free Size"], price: 899, mrp: 1299, stock: 30, sku: "BD-PNK-001", images: [img("dupatta1")] },
          { color: "Blue", size: ["Free Size"], price: 899, mrp: 1299, stock: 22, sku: "BD-BLU-001", images: [img("dupatta1")] },
          { color: "Orange", size: ["Free Size"], price: 949, mrp: 1349, stock: 15, sku: "BD-ORG-001", images: [img("dupatta1")] },
        ],
      },
      // Vendor 2 products
      {
        vendorIdx: 1, catSlug: "kurtis",
        name: "Cotton Printed Kurti", slug: "cotton-printed-kurti",
        description: "Comfortable cotton kurti with block print design. Perfect for daily wear.",
        images: [img("kurti1"), img("kurti2")],
        featured: true, tags: ["cotton", "kurti", "daily-wear", "printed"],
        shippingInfo: { weight: 250, length: 35, breadth: 28, height: 5 },
        status: "approved", totalSold: 120, rating: 4.2, reviewCount: 35,
        variants: [
          { color: "Blue", size: ["S", "M", "L", "XL", "XXL"], price: 599, mrp: 999, stock: 50, sku: "CPK-BLU-001", images: [img("kurti1")] },
          { color: "Green", size: ["S", "M", "L", "XL"], price: 599, mrp: 999, stock: 40, sku: "CPK-GRN-001", images: [img("kurti2")] },
          { color: "Yellow", size: ["M", "L", "XL"], price: 649, mrp: 1049, stock: 2, sku: "CPK-YLW-001", images: [img("kurti1")] },
        ],
      },
      {
        vendorIdx: 1, catSlug: "salwar-suits",
        name: "Embroidered Salwar Suit Set", slug: "embroidered-salwar-suit",
        description: "Elegant salwar kameez set with delicate chikankari embroidery.",
        images: [img("salwar1")],
        tags: ["salwar", "chikankari", "embroidery"],
        shippingInfo: { weight: 600, length: 35, breadth: 30, height: 8 },
        status: "approved", totalSold: 32, rating: 4.6, reviewCount: 14,
        variants: [
          { color: "White", size: ["S", "M", "L", "XL"], price: 1899, mrp: 2499, stock: 15, sku: "ESS-WHT-001", images: [img("salwar1")] },
          { color: "Peach", size: ["S", "M", "L"], price: 1899, mrp: 2499, stock: 12, sku: "ESS-PCH-001", images: [img("salwar1")] },
        ],
      },
      {
        vendorIdx: 1, catSlug: "anarkali",
        name: "Floral Anarkali Suit", slug: "floral-anarkali-suit",
        description: "Flowing anarkali suit with floral digital print. Great for parties and gatherings.",
        images: [img("anarkali1")],
        tags: ["anarkali", "floral", "party-wear"],
        shippingInfo: { weight: 500, length: 35, breadth: 30, height: 8 },
        status: "approved", totalSold: 18, rating: 4.4, reviewCount: 7,
        variants: [
          { color: "Purple", size: ["S", "M", "L", "XL"], price: 2499, mrp: 3499, stock: 10, sku: "FAS-PRP-001", images: [img("anarkali1")] },
          { color: "Teal", size: ["M", "L", "XL"], price: 2499, mrp: 3499, stock: 8, sku: "FAS-TEL-001", images: [img("anarkali1")] },
        ],
      },
      {
        vendorIdx: 1, catSlug: "accessories",
        name: "Kundan Jewelry Set", slug: "kundan-jewelry-set",
        description: "Beautiful kundan necklace and earring set. Perfect to pair with traditional wear.",
        images: [img("jewelry1")],
        tags: ["kundan", "jewelry", "necklace", "earrings"],
        shippingInfo: { weight: 150, length: 20, breadth: 15, height: 5 },
        status: "approved", totalSold: 40, rating: 4.1, reviewCount: 10,
        variants: [
          { color: "Gold", size: ["Free Size"], price: 1499, mrp: 2199, stock: 20, sku: "KJS-GLD-001", images: [img("jewelry1")] },
          { color: "Silver", size: ["Free Size"], price: 1399, mrp: 2099, stock: 15, sku: "KJS-SLV-001", images: [img("jewelry1")] },
        ],
      },
      // Extra: pending/draft products
      {
        vendorIdx: 0, catSlug: "blouses",
        name: "Velvet Designer Blouse", slug: "velvet-designer-blouse",
        description: "Luxurious velvet blouse with hand-embroidered beadwork.",
        images: [img("velvet1")],
        tags: ["velvet", "designer"],
        status: "pending_approval",
        variants: [
          { color: "Black", size: ["S", "M", "L"], price: 1799, mrp: 2499, stock: 12, sku: "VDB-BLK-001", images: [img("velvet1")] },
        ],
      },
      {
        vendorIdx: 1, catSlug: "kurtis",
        name: "Chanderi Silk Kurti", slug: "chanderi-silk-kurti",
        description: "Premium Chanderi silk kurti with block prints.",
        images: [img("chanderi1")],
        tags: ["chanderi", "silk"],
        status: "draft",
        variants: [
          { color: "Beige", size: ["S", "M", "L", "XL"], price: 1299, mrp: 1799, stock: 20, sku: "CSK-BGE-001", images: [img("chanderi1")] },
        ],
      },
    ];

    const products = [];
    const catMap = {};
    categories.forEach(c => { catMap[c.slug] = c._id; });

    for (const pd of PRODUCT_DATA) {
      if (!vendors[pd.vendorIdx]) continue;
      let prod = await Product.findOne({ slug: pd.slug });
      if (!prod) {
        prod = await Product.create({
          vendorId: vendors[pd.vendorIdx]._id,
          name: pd.name,
          slug: pd.slug,
          description: pd.description,
          category: catMap[pd.catSlug],
          images: pd.images || [],
          featured: pd.featured || false,
          variants: pd.variants,
          tags: pd.tags || [],
          shippingInfo: pd.shippingInfo || {},
          status: pd.status || "pending_approval",
          totalSold: pd.totalSold || 0,
          rating: pd.rating || 0,
          reviewCount: pd.reviewCount || 0,
        });
        console.log(`  ✓ ${pd.name} (${pd.status}) — ${pd.variants.length} variants`);
      } else {
        console.log(`  ⚠ Exists: ${pd.name}`);
      }
      products.push(prod);
    }

    // ════════════════════════════════════════════════════════════════════════
    // 8. ORDERS (various statuses)
    // ════════════════════════════════════════════════════════════════════════
    console.log("\n── 8. Creating Orders ─────────────────────────────────────");
    const approvedProducts = products.filter(p => p.status === "approved");
    const existingOrderCount = await Order.countDocuments();

    if (existingOrderCount === 0) {
      const orderConfigs = [
        // Order 1: Delivered - customer1 bought from vendor1
        {
          customerIdx: 0, daysAgo: 20, status: "delivered",
          paymentStatus: "paid", paymentMethod: "razorpay",
          items: [{ productIdx: 0, variantIdx: 0, qty: 1 }], // Silk blouse red
          subStatus: "delivered",
          shipping: { awbCode: "AWB123456789", courier: "Delhivery", shipmentStatus: "Delivered", shippedAt: daysAgo(18), deliveredAt: daysAgo(15) },
          payoutStatus: "paid",
        },
        // Order 2: Shipped - customer1 bought from vendor2
        {
          customerIdx: 0, daysAgo: 7, status: "partially_shipped",
          paymentStatus: "paid", paymentMethod: "razorpay",
          items: [{ productIdx: 4, variantIdx: 0, qty: 2 }, { productIdx: 5, variantIdx: 0, qty: 1 }], // Kurti + Salwar
          subStatus: "shipped",
          shipping: { awbCode: "AWB987654321", courier: "BlueDart", shipmentStatus: "In Transit", shippedAt: daysAgo(5) },
          payoutStatus: "pending",
        },
        // Order 3: Confirmed - customer2 bought from vendor1
        {
          customerIdx: 1, daysAgo: 3, status: "confirmed",
          paymentStatus: "paid", paymentMethod: "razorpay",
          items: [{ productIdx: 1, variantIdx: 0, qty: 1 }], // Kanchi saree
          subStatus: "confirmed",
          payoutStatus: "pending",
        },
        // Order 4: Pending - customer2 bought from vendor1 + vendor2
        {
          customerIdx: 1, daysAgo: 1, status: "pending",
          paymentStatus: "paid", paymentMethod: "razorpay",
          items: [{ productIdx: 3, variantIdx: 0, qty: 3 }, { productIdx: 6, variantIdx: 0, qty: 1 }], // Dupatta + Anarkali
          subStatus: "pending",
          payoutStatus: "pending",
        },
        // Order 5: Cancelled
        {
          customerIdx: 0, daysAgo: 30, status: "cancelled",
          paymentStatus: "refunded", paymentMethod: "razorpay",
          items: [{ productIdx: 7, variantIdx: 0, qty: 1 }], // Kundan set
          subStatus: "cancelled",
          payoutStatus: "pending",
        },
        // Order 6: Delivered with wallet - customer1
        {
          customerIdx: 0, daysAgo: 45, status: "delivered",
          paymentStatus: "paid", paymentMethod: "razorpay",
          walletUsed: 200,
          items: [{ productIdx: 4, variantIdx: 1, qty: 1 }], // Cotton kurti green
          subStatus: "delivered",
          shipping: { awbCode: "AWB111222333", courier: "DTDC", shipmentStatus: "Delivered", shippedAt: daysAgo(42), deliveredAt: daysAgo(40) },
          payoutStatus: "paid",
        },
        // Order 7: Packed - customer2
        {
          customerIdx: 1, daysAgo: 2, status: "confirmed",
          paymentStatus: "paid", paymentMethod: "razorpay",
          items: [{ productIdx: 0, variantIdx: 1, qty: 1 }], // Silk blouse gold
          subStatus: "packed",
          payoutStatus: "pending",
        },
      ];

      for (let oi = 0; oi < orderConfigs.length; oi++) {
        const oc = orderConfigs[oi];
        const customer = customerUsers[oc.customerIdx];
        const addr = customer.addresses?.[0] || { name: customer.name, phone: customer.phone, street: "123 Main St", city: "Chennai", state: "Tamil Nadu", pincode: "600001" };

        // Group items by vendor
        const vendorItems = {};
        let totalAmount = 0;
        let totalMRP = 0;

        for (const item of oc.items) {
          const prod = approvedProducts[item.productIdx];
          if (!prod) continue;
          const variant = prod.variants[item.variantIdx];
          if (!variant) continue;
          const vendorKey = prod.vendorId.toString();
          if (!vendorItems[vendorKey]) vendorItems[vendorKey] = [];
          vendorItems[vendorKey].push({
            productId: prod._id,
            variantId: variant._id,
            name: prod.name,
            image: prod.images[0] || "",
            price: variant.price,
            mrp: variant.mrp,
            quantity: item.qty,
            selectedSize: variant.size[0],
            selectedColor: variant.color,
          });
          totalAmount += variant.price * item.qty;
          totalMRP += variant.mrp * item.qty;
        }

        const walletUsed = oc.walletUsed || 0;
        const payableAmount = totalAmount - walletUsed;

        const subOrders = [];
        let subIdx = 0;
        for (const [vendorIdStr, items] of Object.entries(vendorItems)) {
          const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
          const commRate = 10;
          const commAmount = Math.round(subtotal * commRate / 100);
          subOrders.push({
            vendorId: new mongoose.Types.ObjectId(vendorIdStr),
            subOrderId: genSubOrderId(oi, subIdx),
            items,
            subtotal,
            commission: { rate: commRate, amount: commAmount },
            vendorEarning: subtotal - commAmount,
            status: oc.subStatus,
            statusHistory: [
              { status: "pending", note: "Order placed", date: daysAgo(oc.daysAgo) },
              ...(["confirmed", "packed", "shipped", "delivered"].includes(oc.subStatus)
                ? [{ status: "confirmed", note: "Vendor confirmed", date: daysAgo(oc.daysAgo - 1) }] : []),
              ...(["packed", "shipped", "delivered"].includes(oc.subStatus)
                ? [{ status: "packed", note: "Order packed", date: daysAgo(oc.daysAgo - 1) }] : []),
              ...(["shipped", "delivered"].includes(oc.subStatus)
                ? [{ status: "shipped", note: "Shipment dispatched", date: daysAgo(oc.daysAgo - 2) }] : []),
              ...(oc.subStatus === "delivered"
                ? [{ status: "delivered", note: "Delivered successfully", date: daysAgo(oc.daysAgo - 5) }] : []),
              ...(oc.subStatus === "cancelled"
                ? [{ status: "cancelled", note: "Cancelled by customer", date: daysAgo(oc.daysAgo - 1) }] : []),
            ],
            shipping: oc.shipping || {},
            payoutStatus: oc.payoutStatus,
          });
          subIdx++;
        }

        const orderId = genOrderId(oi);
        await Order.create({
          customerId: customer._id,
          orderId,
          payment: {
            razorpayOrderId: `order_${Date.now().toString(36)}${oi}`,
            razorpayPaymentId: oc.paymentStatus === "paid" ? `pay_${Date.now().toString(36)}${oi}` : undefined,
            method: oc.paymentMethod,
            status: oc.paymentStatus,
            amount: payableAmount,
            paidAt: oc.paymentStatus === "paid" ? daysAgo(oc.daysAgo) : undefined,
          },
          shippingAddress: addr,
          subOrders,
          totalAmount,
          totalMRP,
          discount: 0,
          walletAmountUsed: walletUsed,
          status: oc.status,
          createdAt: daysAgo(oc.daysAgo),
        });
        console.log(`  ✓ ${orderId} — ${oc.status} (${subOrders.length} sub-orders, ₹${totalAmount})`);
      }
    } else {
      console.log(`  ⚠ ${existingOrderCount} orders already exist, skipping`);
    }

    // ════════════════════════════════════════════════════════════════════════
    // 9. CART (active cart for customer1)
    // ════════════════════════════════════════════════════════════════════════
    console.log("\n── 9. Creating Cart ───────────────────────────────────────");
    const existingCart = await Cart.findOne({ userId: customerUsers[0]?._id });
    if (!existingCart && approvedProducts.length >= 2) {
      const p1 = approvedProducts[2]; // Lehenga
      const p2 = approvedProducts[5]; // Salwar
      await Cart.create({
        userId: customerUsers[0]._id,
        cartId: `cart_${customerUsers[0]._id}`,
        items: [
          {
            productId: p1._id, variantId: p1.variants[0]._id, vendorId: p1.vendorId,
            name: p1.name, image: p1.images[0] || "", price: p1.variants[0].price, mrp: p1.variants[0].mrp,
            selectedSize: p1.variants[0].size[0], selectedColor: p1.variants[0].color, quantity: 1,
          },
          {
            productId: p2._id, variantId: p2.variants[0]._id, vendorId: p2.vendorId,
            name: p2.name, image: p2.images[0] || "", price: p2.variants[0].price, mrp: p2.variants[0].mrp,
            selectedSize: p2.variants[0].size[0], selectedColor: p2.variants[0].color, quantity: 2,
          },
        ],
      });
      console.log("  ✓ Cart for Anandhi: 2 items (Lehenga + Salwar Suit)");
    } else {
      console.log("  ⚠ Cart already exists or no products");
    }

    // ════════════════════════════════════════════════════════════════════════
    // 10. TRANSACTIONS
    // ════════════════════════════════════════════════════════════════════════
    console.log("\n── 10. Creating Transactions ──────────────────────────────");
    const existingTxns = await Transaction.countDocuments();
    if (existingTxns === 0) {
      // Vendor wallet transactions
      if (vendorWallets[0]) {
        const txns = [
          { walletId: vendorWallets[0]._id, type: "credit", amount: 1169, reason: "order_earning", referenceId: "YOS-100000", note: "Earning from order YOS-100000", balanceAfter: 1169 },
          { walletId: vendorWallets[0]._id, type: "credit", amount: 4499, reason: "order_earning", referenceId: "YOS-100002", note: "Earning from order YOS-100002", balanceAfter: 5668 },
          { walletId: vendorWallets[0]._id, type: "debit", amount: 2000, reason: "payout", note: "Payout request approved", balanceAfter: 3668 },
          { walletId: vendorWallets[0]._id, type: "credit", amount: 539, reason: "order_earning", referenceId: "YOS-100005", note: "Earning from order YOS-100005", balanceAfter: 4207 },
        ];
        for (const t of txns) await Transaction.create(t);
        console.log(`  ✓ ${txns.length} transactions for ${vendors[0].brandName}`);
      }
      if (vendorWallets[1]) {
        const txns = [
          { walletId: vendorWallets[1]._id, type: "credit", amount: 1978, reason: "order_earning", referenceId: "YOS-100001", note: "Earning from order YOS-100001", balanceAfter: 1978 },
          { walletId: vendorWallets[1]._id, type: "credit", amount: 2249, reason: "order_earning", referenceId: "YOS-100003", note: "Earning from order YOS-100003", balanceAfter: 4227 },
        ];
        for (const t of txns) await Transaction.create(t);
        console.log(`  ✓ ${txns.length} transactions for ${vendors[1].brandName}`);
      }
      // Customer wallet transactions
      if (customerWallets[0]) {
        const txns = [
          { walletId: customerWallets[0]._id, type: "credit", amount: 500, reason: "manual", note: "Welcome bonus", balanceAfter: 500 },
          { walletId: customerWallets[0]._id, type: "debit", amount: 200, reason: "wallet_use", referenceId: "YOS-100005", note: "Used in order YOS-100005", balanceAfter: 300 },
          { walletId: customerWallets[0]._id, type: "credit", amount: 1499, reason: "refund", referenceId: "YOS-100004", note: "Refund for cancelled order", balanceAfter: 1799 },
        ];
        for (const t of txns) await Transaction.create(t);
        console.log(`  ✓ ${txns.length} transactions for ${customerUsers[0].name}`);
      }
    } else {
      console.log(`  ⚠ ${existingTxns} transactions exist, skipping`);
    }

    // ════════════════════════════════════════════════════════════════════════
    // 11. COUPONS
    // ════════════════════════════════════════════════════════════════════════
    console.log("\n── 11. Creating Coupons ───────────────────────────────────");
    const couponData = [
      {
        code: "WELCOME10", description: "10% off on first order",
        discountType: "percentage", discountValue: 10,
        minPurchaseAmount: 500, maxDiscountAmount: 200,
        validFrom: daysAgo(60), validTill: new Date(Date.now() + 90 * 86400000),
        maxUsageLimit: 1000, maxUsagePerCustomer: 1, usedCount: 45, isActive: true,
      },
      {
        code: "FLAT200", description: "Flat ₹200 off on orders above ₹1500",
        discountType: "flat", discountValue: 200,
        minPurchaseAmount: 1500,
        validFrom: daysAgo(30), validTill: new Date(Date.now() + 60 * 86400000),
        maxUsageLimit: 500, maxUsagePerCustomer: 2, usedCount: 12, isActive: true,
      },
      {
        code: "PRIYA15", description: "15% off on Priya Boutique products",
        vendorId: vendors[0]?._id,
        discountType: "percentage", discountValue: 15,
        minPurchaseAmount: 1000, maxDiscountAmount: 500,
        validFrom: daysAgo(10), validTill: new Date(Date.now() + 30 * 86400000),
        maxUsageLimit: 100, maxUsagePerCustomer: 1, usedCount: 3, isActive: true,
      },
      {
        code: "RAVI100", description: "₹100 off on Ravi Textiles",
        vendorId: vendors[1]?._id,
        discountType: "flat", discountValue: 100,
        minPurchaseAmount: 500,
        validFrom: daysAgo(5), validTill: new Date(Date.now() + 45 * 86400000),
        maxUsageLimit: 200, maxUsagePerCustomer: 1, usedCount: 0, isActive: true,
      },
      {
        code: "EXPIRED50", description: "Expired coupon for testing",
        discountType: "percentage", discountValue: 50,
        minPurchaseAmount: 0,
        validFrom: daysAgo(90), validTill: daysAgo(30),
        maxUsageLimit: 10, usedCount: 10, isActive: false,
      },
    ];

    for (const cd of couponData) {
      const exists = await Coupon.findOne({ code: cd.code });
      if (!exists) {
        await Coupon.create(cd);
        console.log(`  ✓ ${cd.code} — ${cd.description}`);
      } else {
        console.log(`  ⚠ Exists: ${cd.code}`);
      }
    }

    // ════════════════════════════════════════════════════════════════════════
    // 12. SUPPORT TICKETS
    // ════════════════════════════════════════════════════════════════════════
    console.log("\n── 12. Creating Support Tickets ───────────────────────────");
    const existingTickets = await SupportTicket.countDocuments();
    if (existingTickets === 0) {
      const tickets = [
        {
          ticketNumber: "TKT-000001",
          userId: customerUsers[0]._id,
          orderId: "YOS-100001",
          subject: "Order not received yet",
          description: "My order YOS-100001 was supposed to be delivered 2 days ago but I haven't received it. The tracking shows it's still in transit. Can you please check?",
          category: "shipping", priority: "high", status: "in_progress",
          replies: [
            { senderId: adminUser._id, senderRole: "admin", message: "We apologize for the delay. We've contacted the courier and they confirmed your package will be delivered within the next 24 hours." },
          ],
        },
        {
          ticketNumber: "TKT-000002",
          userId: customerUsers[1]._id,
          subject: "Wrong size received",
          description: "I ordered a Medium size kurti but received a Large. Please help me with a return/exchange.",
          category: "product", priority: "medium", status: "open",
          replies: [],
        },
        {
          ticketNumber: "TKT-000003",
          userId: customerUsers[0]._id,
          subject: "Refund not credited",
          description: "I cancelled my order YOS-100004 a week ago but the refund hasn't been credited to my wallet yet.",
          category: "refund", priority: "high", status: "resolved",
          resolvedAt: daysAgo(2),
          replies: [
            { senderId: adminUser._id, senderRole: "admin", message: "We've checked and the refund of ₹1,499 has been credited to your wallet. Please check your wallet balance." },
            { senderId: customerUsers[0]._id, senderRole: "customer", message: "Yes, I can see it now. Thank you!" },
          ],
        },
        {
          ticketNumber: "TKT-000004",
          userId: vendorUsers[0]._id,
          subject: "Payout pending for 5 days",
          description: "I requested a payout of ₹2,000 five days ago but it's still showing as pending. When will it be processed?",
          category: "payment", priority: "medium", status: "open",
          replies: [],
        },
        {
          ticketNumber: "TKT-000005",
          userId: customerUsers[1]._id,
          subject: "How to apply coupon code?",
          description: "I have a coupon code WELCOME10 but I'm not sure where to apply it during checkout. Can you guide me?",
          category: "other", priority: "low", status: "closed",
          closedAt: daysAgo(5),
          replies: [
            { senderId: adminUser._id, senderRole: "admin", message: "During checkout, you'll see a 'Apply Coupon' field below the order summary. Enter your coupon code there and click Apply. The discount will be reflected in your total." },
            { senderId: customerUsers[1]._id, senderRole: "customer", message: "Got it, thanks! It worked." },
          ],
        },
      ];

      for (const td of tickets) {
        await SupportTicket.create(td);
        console.log(`  ✓ ${td.ticketNumber} — ${td.subject} (${td.status})`);
      }
    } else {
      console.log(`  ⚠ ${existingTickets} tickets exist, skipping`);
    }

    // ════════════════════════════════════════════════════════════════════════
    // 13. PAYOUT REQUESTS
    // ════════════════════════════════════════════════════════════════════════
    console.log("\n── 13. Creating Payout Requests ──────────────────────────");
    const existingPayouts = await PayoutRequest.countDocuments();
    if (existingPayouts === 0 && vendors.length > 0) {
      const payouts = [
        {
          vendorId: vendors[0]._id, amount: 2000, status: "approved",
          note: "Monthly payout request", adminNote: "Verified and approved",
          processedAt: daysAgo(10), processedBy: adminUser._id,
        },
        {
          vendorId: vendors[0]._id, amount: 1500, status: "pending",
          note: "Payout for recent orders",
        },
        {
          vendorId: vendors[1]._id, amount: 1000, status: "pending",
          note: "First payout request",
        },
        {
          vendorId: vendors[1]._id, amount: 500, status: "rejected",
          note: "Urgent payout needed", adminNote: "Minimum payout is ₹1,000. Please accumulate more balance.",
          processedAt: daysAgo(5), processedBy: adminUser._id,
        },
      ];

      for (const pd of payouts) {
        await PayoutRequest.create(pd);
        console.log(`  ✓ ₹${pd.amount} — ${pd.status} (${vendors.find(v => v._id.equals(pd.vendorId))?.brandName})`);
      }
    } else {
      console.log(`  ⚠ ${existingPayouts} payout requests exist, skipping`);
    }

    // ════════════════════════════════════════════════════════════════════════
    // 14. NOTIFICATIONS
    // ════════════════════════════════════════════════════════════════════════
    console.log("\n── 14. Creating Notifications ─────────────────────────────");
    const existingNotifs = await Notification.countDocuments();
    if (existingNotifs === 0) {
      const notifications = [
        // Customer notifications
        { userId: customerUsers[0]._id, title: "Order Delivered", message: "Your order YOS-100000 has been delivered successfully!", type: "order_delivered", referenceId: "YOS-100000", isRead: true },
        { userId: customerUsers[0]._id, title: "Order Shipped", message: "Your order YOS-100001 has been shipped. Track it now!", type: "order_shipped", referenceId: "YOS-100001", isRead: true },
        { userId: customerUsers[0]._id, title: "Refund Credited", message: "₹1,499 has been refunded to your wallet for order YOS-100004.", type: "refund_credited", referenceId: "YOS-100004", isRead: false },
        { userId: customerUsers[1]._id, title: "Order Confirmed", message: "Your order YOS-100002 has been confirmed by the vendor.", type: "order_confirmed", referenceId: "YOS-100002", isRead: false },
        { userId: customerUsers[1]._id, title: "Order Placed", message: "Your order YOS-100003 has been placed successfully!", type: "order_placed", referenceId: "YOS-100003", isRead: false },

        // Vendor notifications
        { userId: vendorUsers[0]._id, title: "New Order Received", message: "You have a new order YOS-100002 for Kanchipuram Silk Saree.", type: "order_placed", referenceId: "YOS-100002", isRead: false },
        { userId: vendorUsers[0]._id, title: "Product Approved", message: "Your product 'Silk Embroidered Blouse' has been approved and is now live!", type: "product_approved", isRead: true },
        { userId: vendorUsers[0]._id, title: "Low Stock Alert", message: "Navy Blue variant of Silk Embroidered Blouse has only 3 items left.", type: "low_stock", isRead: false },
        { userId: vendorUsers[0]._id, title: "Payout Processed", message: "Your payout of ₹2,000 has been approved and transferred.", type: "payout_processed", isRead: true },
        { userId: vendorUsers[1]._id, title: "New Order Received", message: "You have a new order YOS-100001 for Cotton Printed Kurti.", type: "order_placed", referenceId: "YOS-100001", isRead: false },
        { userId: vendorUsers[1]._id, title: "Low Stock Alert", message: "Yellow variant of Cotton Printed Kurti has only 2 items left.", type: "low_stock", isRead: false },
        { userId: vendorUsers[1]._id, title: "KYC Update", message: "Your KYC documents have been verified successfully.", type: "kyc_update", isRead: true },
      ];

      for (const nd of notifications) await Notification.create(nd);
      console.log(`  ✓ ${notifications.length} notifications created`);
    } else {
      console.log(`  ⚠ ${existingNotifs} notifications exist, skipping`);
    }

    // ════════════════════════════════════════════════════════════════════════
    // 15. INVENTORY LOGS
    // ════════════════════════════════════════════════════════════════════════
    console.log("\n── 15. Creating Inventory Logs ────────────────────────────");
    const existingLogs = await InventoryLog.countDocuments();
    if (existingLogs === 0 && approvedProducts.length > 0) {
      const logs = [];
      for (const prod of approvedProducts.slice(0, 5)) {
        for (const variant of prod.variants) {
          // Initial stock addition
          logs.push({
            productId: prod._id, variantId: variant._id, vendorId: prod.vendorId,
            type: "addition", quantity: variant.stock + 10, previousStock: 0, newStock: variant.stock + 10,
            reason: "restock", note: "Initial stock",
          });
          // Order deduction
          if (prod.totalSold > 0) {
            const sold = Math.min(10, prod.totalSold);
            logs.push({
              productId: prod._id, variantId: variant._id, vendorId: prod.vendorId,
              type: "deduction", quantity: sold, previousStock: variant.stock + 10, newStock: variant.stock + 10 - sold,
              reason: "order_placed", note: "Orders fulfilled",
            });
          }
        }
      }
      for (const l of logs) await InventoryLog.create(l);
      console.log(`  ✓ ${logs.length} inventory logs created`);
    } else {
      console.log(`  ⚠ ${existingLogs} inventory logs exist, skipping`);
    }

    // ════════════════════════════════════════════════════════════════════════
    // 16. MESSAGES
    // ════════════════════════════════════════════════════════════════════════
    console.log("\n── 16. Creating Messages ──────────────────────────────────");
    const existingMsgs = await Message.countDocuments();
    if (existingMsgs === 0) {
      const convId = `conv_${customerUsers[0]._id}_${vendorUsers[0]._id}`;
      const messages = [
        { conversationId: convId, senderId: customerUsers[0]._id, senderRole: "customer", receiverId: vendorUsers[0]._id, receiverRole: "vendor", message: "Hi, is the Silk Embroidered Blouse available in size XL in Gold color?", isRead: true },
        { conversationId: convId, senderId: vendorUsers[0]._id, senderRole: "vendor", receiverId: customerUsers[0]._id, receiverRole: "customer", message: "Hello! Unfortunately Gold is only available in S, M, and L. We can custom stitch XL for you. Would you like that?", isRead: true },
        { conversationId: convId, senderId: customerUsers[0]._id, senderRole: "customer", receiverId: vendorUsers[0]._id, receiverRole: "vendor", message: "That would be great! How long will it take?", isRead: true },
        { conversationId: convId, senderId: vendorUsers[0]._id, senderRole: "vendor", receiverId: customerUsers[0]._id, receiverRole: "customer", message: "Custom stitching takes about 5-7 working days. You can place the order and mention 'XL custom' in the notes.", isRead: false },
      ];
      for (const m of messages) await Message.create(m);
      console.log(`  ✓ ${messages.length} messages in 1 conversation`);
    } else {
      console.log(`  ⚠ ${existingMsgs} messages exist, skipping`);
    }

    // ════════════════════════════════════════════════════════════════════════
    // SUMMARY
    // ════════════════════════════════════════════════════════════════════════
    console.log("\n");
    console.log("═══════════════════════════════════════════════════════════");
    console.log("  SEED COMPLETE — All Dummy Data Created!");
    console.log("═══════════════════════════════════════════════════════════");
    console.log("");
    console.log("  Login Credentials:");
    console.log("  ─────────────────────────────────────────────────────────");
    console.log("  Role       Email                    Password");
    console.log("  ─────────────────────────────────────────────────────────");
    console.log("  Admin      admin@yosai.com           Admin@123");
    console.log("  Vendor 1   vendor@yosai.com          Vendor@123");
    console.log("  Vendor 2   vendor2@yosai.com         Vendor@123");
    console.log("  Customer 1 customer@yosai.com        Customer@123");
    console.log("  Customer 2 customer2@yosai.com       Customer@123");
    console.log("  ─────────────────────────────────────────────────────────");
    console.log("");
    console.log("  Data Summary:");
    console.log("  ─────────────────────────────────────────────────────────");
    console.log(`  Users:            ${await User.countDocuments()}`);
    console.log(`  Categories:       ${await Category.countDocuments()}`);
    console.log(`  Vendors:          ${await Vendor.countDocuments()}`);
    console.log(`  Products:         ${await Product.countDocuments()}`);
    console.log(`  Orders:           ${await Order.countDocuments()}`);
    console.log(`  Carts:            ${await Cart.countDocuments()}`);
    console.log(`  Wallets:          ${await Wallet.countDocuments()}`);
    console.log(`  Transactions:     ${await Transaction.countDocuments()}`);
    console.log(`  Coupons:          ${await Coupon.countDocuments()}`);
    console.log(`  Support Tickets:  ${await SupportTicket.countDocuments()}`);
    console.log(`  Payout Requests:  ${await PayoutRequest.countDocuments()}`);
    console.log(`  Notifications:    ${await Notification.countDocuments()}`);
    console.log(`  Bank Details:     ${await VendorBankDetail.countDocuments()}`);
    console.log(`  Doc Masters:      ${await DocumentMaster.countDocuments()}`);
    console.log(`  Vendor Docs:      ${await VendorDocument.countDocuments()}`);
    console.log(`  Inventory Logs:   ${await InventoryLog.countDocuments()}`);
    console.log(`  Messages:         ${await Message.countDocuments()}`);
    console.log(`  Commissions:      ${await Commission.countDocuments()}`);
    console.log("  ─────────────────────────────────────────────────────────");
    console.log("");
    console.log("  Tip: Run with --fresh to drop all data and reseed");
    console.log("        node scripts/seed.js --fresh");
    console.log("═══════════════════════════════════════════════════════════\n");

  } catch (err) {
    console.error("\n✗ Seed failed:", err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
