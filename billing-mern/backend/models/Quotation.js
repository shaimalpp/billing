const mongoose = require("mongoose");

const ChargeItemSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    amount: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const QuotationSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    materialCharges: [ChargeItemSchema],
    labourCharges: [ChargeItemSchema],
    otherCharges: [ChargeItemSchema],
    totalAmount: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "sent", "approved", "rejected"], default: "draft" },
  },
  { timestamps: true }
);

QuotationSchema.pre("save", function (next) {
  const sum = (arr) => (arr || []).reduce((s, i) => s + (i.amount || 0), 0);
  this.totalAmount =
    sum(this.materialCharges) + sum(this.labourCharges) + sum(this.otherCharges);
  next();
});

module.exports = mongoose.model("Quotation", QuotationSchema);
