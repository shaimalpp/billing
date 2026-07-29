const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String },
    role: { type: String, default: "Technician" },
    hourlyRate: { type: Number, default: 0 },
    dailyRate: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", EmployeeSchema);
