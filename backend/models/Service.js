const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: [
        "Identity Documents",
        "Government Documents",
        "Government Schemes",
        "Printing",
        "Online Services",
        "Other",
      ],
      default: "Other",
    },
    description: { type: String, default: "" },
    price: { type: Number, required: true }, // in INR
    requiredDocuments: [{ type: String }], // e.g. ["Passport size photo", "Existing Aadhaar copy"]
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", ServiceSchema);