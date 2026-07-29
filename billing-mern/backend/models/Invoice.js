const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    quotation: { type: mongoose.Schema.Types.ObjectId, ref: "Quotation" },
    totalAmount: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 },
    profit: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", InvoiceSchema);
