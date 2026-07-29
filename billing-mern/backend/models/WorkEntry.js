const mongoose = require("mongoose");

const WorkEntrySchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    date: { type: Date, required: true, default: Date.now },
    hours: { type: Number, default: 0 },
    overtimeHours: { type: Number, default: 0 },
    rate: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

WorkEntrySchema.pre("save", function (next) {
  this.amount = this.rate * this.hours + this.rate * 1.5 * this.overtimeHours;
  next();
});

module.exports = mongoose.model("WorkEntry", WorkEntrySchema);
