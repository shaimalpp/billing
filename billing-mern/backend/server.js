require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/customers", require("./routes/customers"));
app.use("/api/employees", require("./routes/employees"));
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/quotations", require("./routes/quotations"));
app.use("/api/workentries", require("./routes/workentries"));
app.use("/api/expenses", require("./routes/expenses"));
app.use("/api/invoices", require("./routes/invoices"));
app.use("/api/settings", require("./routes/settings"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/reports", require("./routes/reports"));

app.get("/", (req, res) => {
  res.json({ message: "Electrical & Plumbing Billing Software API is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

