import mongoose from 'mongoose';

const payoutRequestSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
    index: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 1,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    index: true,
  },
  transactionRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
  },
  note: {
    type: String,
    trim: true,
  },
  adminNote: {
    type: String,
    trim: true,
  },
  processedAt: {
    type: Date,
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

export default mongoose.model('PayoutRequest', payoutRequestSchema);
