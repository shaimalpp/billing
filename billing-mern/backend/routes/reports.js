const express = require("express");
const router = express.Router();
const Invoice = require("../models/Invoice");
const Expense = require("../models/Expense");
const WorkEntry = require("../models/WorkEntry");
const Employee = require("../models/Employee");

// GET /api/reports/profit-analysis?months=6
router.get("/profit-analysis", async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 6;
    const now = new Date();
    const results = [];

    for (let i = months - 1; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const invoices = await Invoice.find({ date: { $gte: start, $lt: end } });
      const expenses = await Expense.find({ date: { $gte: start, $lt: end } });

      const income = invoices.reduce((s, i) => s + (i.totalAmount || 0), 0);
      const expenseTotal = expenses.reduce((s, e) => s + (e.amount || 0), 0);

      results.push({
        month: start.toLocaleString("default", { month: "short", year: "numeric" }),
        income,
        expenses: expenseTotal,
        netProfit: income - expenseTotal,
      });
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/reports/salary-summary?start=&end=
router.get("/salary-summary", async (req, res) => {
  try {
    const { start, end } = req.query;
    const filter = {};
    if (start && end) filter.date = { $gte: new Date(start), $lt: new Date(end) };

    const entries = await WorkEntry.find(filter).populate("employee");

    const byEmployee = {};
    entries.forEach((e) => {
      if (!e.employee) return;
      const id = e.employee._id.toString();
      if (!byEmployee[id]) {
        byEmployee[id] = {
          employee: e.employee.name,
          totalHours: 0,
          overtimeHours: 0,
          totalPay: 0,
        };
      }
      byEmployee[id].totalHours += e.hours || 0;
      byEmployee[id].overtimeHours += e.overtimeHours || 0;
      byEmployee[id].totalPay += e.amount || 0;
    });

    res.json(Object.values(byEmployee));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/reports/summary - general profit/loss report
router.get("/summary", async (req, res) => {
  try {
    const invoices = await Invoice.find();
    const expenses = await Expense.find();
    const totalIncome = invoices.reduce((s, i) => s + (i.totalAmount || 0), 0);
    const totalExpenses = expenses.reduce((s, e) => s + (e.amount || 0), 0);

    res.json({
      totalIncome,
      totalExpenses,
      netProfit: totalIncome - totalExpenses,
      invoiceCount: invoices.length,
      expenseCount: expenses.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
