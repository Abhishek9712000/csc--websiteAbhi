const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
  {
    originalName: String,
    storedName: String, // filename on disk
    fileType: String,
  },
  { _id: false }
);

const ApplicationSchema = new mongoose.Schema(
  {
    referenceId: { type: String, required: true, unique: true }, // 6-digit number
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    serviceName: String, // snapshot at time of application

    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String },
    notes: { type: String },

    documents: [DocumentSchema],

    amount: { type: Number, required: true },

    // ===== Payment Fields =====
    paymentStatus: {
      type: String,
      enum: ["pending", "submitted", "verified", "paid", "failed"],
      default: "pending",
    },
    paymentUtr: { type: String }, // UPI transaction ref OR Razorpay payment id
    paymentScreenshot: DocumentSchema,

    // Razorpay specific
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },

    // ===== Work Status =====
    status: {
      type: String,
      enum: ["received", "in_progress", "awaiting_documents", "completed", "rejected"],
      default: "received",
    },
    adminNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", ApplicationSchema);