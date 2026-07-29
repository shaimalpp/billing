const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema(
  {
    companyName: { type: String, default: "EP Services" },
    tagline: { type: String, default: "Electrical & Plumbing Service Company" },
    logoUrl: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    expenseCategories: {
      type: [String],
      default: ["Fuel", "Food", "Travel", "Material", "Other"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", SettingsSchema);
