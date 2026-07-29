const express = require("express");
const router = express.Router();
const Quotation = require("../models/Quotation");
const Job = require("../models/Job");

router.get("/", async (req, res) => {
  try {
    const quotations = await Quotation.find()
      .populate("customer")
      .populate("job")
      .sort({ createdAt: -1 });
    res.json(quotations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id)
      .populate("customer")
      .populate("job");
    if (!quotation) return res.status(404).json({ message: "Quotation not found" });
    res.json(quotation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const quotation = await Quotation.create(req.body);
    if (req.body.job) {
      await Job.findByIdAndUpdate(req.body.job, { quotation: quotation._id });
    }
    res.status(201).json(quotation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) return res.status(404).json({ message: "Quotation not found" });
    Object.assign(quotation, req.body);
    await quotation.save();
    res.json(quotation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const quotation = await Quotation.findByIdAndDelete(req.params.id);
    if (!quotation) return res.status(404).json({ message: "Quotation not found" });
    res.json({ message: "Quotation deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
