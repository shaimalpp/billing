const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["Fuel", "Food", "Travel", "Material", "Other"],
      default: "Other",
    },
    description: { type: String },
    amount: { type: Number, required: true, default: 0 },
    date: { type: Date, required: true, default: Date.now },
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", ExpenseSchema);
