const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    pendingBalance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", CustomerSchema);
