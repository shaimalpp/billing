import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import api from "../api/axios";
import Topbar from "../components/Topbar.jsx";
import DataTable from "../components/DataTable.jsx";

export default function ProfitAnalysis() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/reports/profit-analysis?months=6").then((res) => setData(res.data));
  }, []);

  return (
    <>
      <Topbar
        title="Profit Analysis"
        subtitle="Analyze income, expenses and net profit · Malayalam: ലാഭ-നഷ്ട വിശകലനം ചെയ്യുക"
      />
      <div className="page-body">
        <div className="card">
          <div className="card-header">
            <h3>Profit / Loss Trend (Last 6 Months)</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(v) => `₹ ${v.toLocaleString("en-IN")}`} />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#2563eb" name="Income" />
              <Line type="monotone" dataKey="expenses" stroke="#dc2626" name="Expenses" />
              <Line type="monotone" dataKey="netProfit" stroke="#16a34a" name="Net Profit" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Monthly Breakdown</h3>
          </div>
          <DataTable
            columns={[
              { key: "month", label: "Month" },
              { key: "income", label: "Income", render: (r) => `₹ ${r.income.toLocaleString("en-IN")}` },
              { key: "expenses", label: "Expenses", render: (r) => `₹ ${r.expenses.toLocaleString("en-IN")}` },
              { key: "netProfit", label: "Net Profit", render: (r) => `₹ ${r.netProfit.toLocaleString("en-IN")}` },
            ]}
            rows={data}
          />
        </div>
      </div>
    </>
  );
}
