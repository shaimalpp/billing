import { useEffect, useState } from "react";
import api from "../api/axios";
import Topbar from "../components/Topbar.jsx";
import StatCard from "../components/StatCard.jsx";
import DataTable from "../components/DataTable.jsx";

export default function Reports() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get("/reports/summary").then((res) => setSummary(res.data));
  }, []);

  const reportTypes = [
    { name: "Profit & Loss Report", desc: "Income vs expenses over time" },
    { name: "Customer Billing Report", desc: "Invoices and pending balances per customer" },
    { name: "Employee Salary Report", desc: "Hours worked and salary paid" },
    { name: "Expense Report", desc: "Expenses by category" },
  ];

  return (
    <>
      <Topbar
        title="Reports"
        subtitle="Generate profit/loss and other reports · Malayalam: റിപ്പോർട്ടുകൾ തയ്യാറാക്കുക"
      />
      <div className="page-body">
        <div className="stat-cards">
          <StatCard icon="₹" label="Total Income" value={`₹ ${(summary?.totalIncome ?? 0).toLocaleString("en-IN")}`} color="#2563eb" />
          <StatCard icon="💳" label="Total Expenses" value={`₹ ${(summary?.totalExpenses ?? 0).toLocaleString("en-IN")}`} color="#dc2626" />
          <StatCard icon="📈" label="Net Profit" value={`₹ ${(summary?.netProfit ?? 0).toLocaleString("en-IN")}`} color="#16a34a" />
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Available Reports</h3>
          </div>
          <DataTable
            columns={[
              { key: "name", label: "Report" },
              { key: "desc", label: "Description" },
              {
                key: "action",
                label: "",
                render: () => (
                  <button className="btn btn-outline btn-sm" onClick={() => window.print()}>
                    Export / Print
                  </button>
                ),
              },
            ]}
            rows={reportTypes}
          />
        </div>
      </div>
    </>
  );
}
