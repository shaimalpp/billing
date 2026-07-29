const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    type: { type: String, enum: ["Electrical", "Plumbing", "Both"], default: "Electrical" },
    status: { type: String, enum: ["active", "completed", "cancelled"], default: "active" },
    assignedEmployees: [
      {
        employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
        workRate: { type: Number, default: 0 },
      },
    ],
    quotation: { type: mongoose.Schema.Types.ObjectId, ref: "Quotation" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
