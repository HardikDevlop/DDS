import mongoose from "mongoose";

// Sub-service schema for additional services under each item
const subServiceSchema = new mongoose.Schema(
  {
    title: String,
    price: Number,
  },
  { _id: false }
);

// Feedback schema for both customer and partner feedback
const feedbackSchema = new mongoose.Schema(
  {
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String },
  },
  { _id: false }
);

// Provider details assigned by admin
const providerDetailsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String },
    note: { type: String },
    assignedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      title: String,
      price: Number,
      imageUrl: String,
      quantity: {
        type: Number,
        default: 1,
      },
      subServices: [subServiceSchema],
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  address: {
    houseNumber: { type: String, required: true },
    street: { type: String, required: true },
    landmark: { type: String },
    addressType: { type: String, enum: ["Home", "Office", "Other"], required: true },
    fullAddress: { type: String, required: true },
    timeSlot: { type: String, required: true },
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "processing", "Completed", "Cancelled", "Declined"],
    default: "Pending",
  },
  assignedPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Partner",
  },

  // ✅ NEW: Human-readable provider details filled by admin
  assignedProviderDetails: {
    type: providerDetailsSchema,
    default: null,
  },

  requestStatus: {
    type: String,
    enum: ["Pending", "Accepted", "Declined", "NoPartner", "No service provider is available"],
    default: "Pending",
  },
  requestExpiresAt: { type: Date },

  rejectedPartners: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  startedAt: { type: Date, default: null },
  completedAt: { type: Date, default: null },

  // Codes for workflow
  happyCode: { type: String },      // 4-digit code shown to user; provider gives to admin to start
  completeCode: { type: String },   // kept in DB but no longer shown on client

  // Feedback
  partnerFeedback: feedbackSchema,
  customerFeedback: feedbackSchema,

  paymentId: { type: String },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Order", orderSchema);