const express = require("express");
const router = express.Router();
const Invoice = require("../models/Invoice");
const Customer = require("../models/Customer");

router.get("/", async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("customer")
      .populate("job")
      .populate("quotation")
      .sort({ date: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("customer")
      .populate("job")
      .populate("quotation");
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { totalAmount = 0, totalCost = 0 } = req.body;
    const invoiceNumber =
      req.body.invoiceNumber || "INV-" + Date.now().toString().slice(-8);
    const invoice = await Invoice.create({
      ...req.body,
      invoiceNumber,
      profit: totalAmount - totalCost,
    });
    if (req.body.customer) {
      await Customer.findByIdAndUpdate(req.body.customer, {
        $inc: { pendingBalance: totalAmount },
      });
    }
    res.status(201).json(invoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json({ message: "Invoice deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
