const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: "Shop Owner" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", AdminSchema);
