const express = require("express");
const router = express.Router();
const WorkEntry = require("../models/WorkEntry");

router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.employee) filter.employee = req.query.employee;
    if (req.query.job) filter.job = req.query.job;
    const entries = await WorkEntry.find(filter)
      .populate("employee")
      .populate("job")
      .sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const entry = await WorkEntry.create(req.body);
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const entry = await WorkEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });
    Object.assign(entry, req.body);
    await entry.save();
    res.json(entry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const entry = await WorkEntry.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });
    res.json({ message: "Entry deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
