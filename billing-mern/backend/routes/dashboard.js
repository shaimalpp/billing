const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");
const Employee = require("../models/Employee");
const Job = require("../models/Job");
const Invoice = require("../models/Invoice");
const Expense = require("../models/Expense");

function monthRange(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return { start, end };
}

// GET /api/dashboard - summary cards for the dashboard screen
router.get("/", async (req, res) => {
  try {
    const { start, end } = monthRange();

    const [totalCustomers, activeJobs, totalEmployees] = await Promise.all([
      Customer.countDocuments(),
      Job.countDocuments({ status: "active" }),
      Employee.countDocuments(),
    ]);

    const invoicesThisMonth = await Invoice.find({ date: { $gte: start, $lt: end } });
    const expensesThisMonth = await Expense.find({ date: { $gte: start, $lt: end } });

    const totalBilling = invoicesThisMonth.reduce((s, i) => s + (i.totalAmount || 0), 0);
    const totalExpenses = expensesThisMonth.reduce((s, e) => s + (e.amount || 0), 0);
    const totalProfit = invoicesThisMonth.reduce((s, i) => s + (i.profit || 0), 0);

    const pendingJobs = await Job.countDocuments({ status: { $ne: "completed" } });

    const recentJobs = await Job.find()
      .populate("customer")
      .sort({ createdAt: -1 })
      .limit(5);

    const expenseByCategory = {};
    expensesThisMonth.forEach((e) => {
      expenseByCategory[e.category] = (expenseByCategory[e.category] || 0) + e.amount;
    });

    res.json({
      totalCustomers,
      activeJobs,
      totalEmployees,
      pendingJobs,
      totalBillingThisMonth: totalBilling,
      totalExpensesThisMonth: totalExpenses,
      totalProfitThisMonth: totalProfit,
      expenseByCategory,
      recentJobs,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
