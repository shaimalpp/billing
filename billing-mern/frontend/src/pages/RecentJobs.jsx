import { useEffect, useState } from "react";
import api from "../api/axios";
import Topbar from "../components/Topbar.jsx";
import StatCard from "../components/StatCard.jsx";
import DataTable from "../components/DataTable.jsx";

export default function RecentJobs() {
  const [dashboard, setDashboard] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    api.get("/dashboard").then((res) => setDashboard(res.data));
    api.get("/jobs").then((res) => setJobs(res.data.slice(0, 8)));
    api.get("/expenses").then((res) => setExpenses(res.data.slice(0, 6)));
  }, []);

  return (
    <>
      <Topbar
        title="Profit & Recent Jobs"
        subtitle="View monthly profit, recent jobs and expense summary · Malayalam: മാസ ലാഭവും ജോലികളും കാണിക്കുന്നു"
      />
      <div className="page-body">
        <div className="stat-cards">
          <StatCard
            icon="₹"
            label="Monthly Profit"
            value={`₹ ${(dashboard?.totalProfitThisMonth ?? 0).toLocaleString("en-IN")}`}
            color="#16a34a"
          />
          <StatCard icon="🛠️" label="Total Jobs" value={jobs.length} color="#2563eb" />
          <StatCard
            icon="💳"
            label="Total Expenses"
            value={`₹ ${(dashboard?.totalExpensesThisMonth ?? 0).toLocaleString("en-IN")}`}
            color="#f97316"
          />
        </div>

        <div className="grid-2">
          <div className="card">
            <div className="card-header">
              <h3>Recent Jobs</h3>
            </div>
            <DataTable
              columns={[
                { key: "title", label: "Job" },
                { key: "customer", label: "Customer", render: (r) => r.customer?.name || "-" },
                {
                  key: "status",
                  label: "Status",
                  render: (r) => (
                    <span className={`badge ${r.status === "active" ? "green" : "blue"}`}>
                      {r.status}
                    </span>
                  ),
                },
              ]}
              rows={jobs}
            />
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Expense Summary</h3>
            </div>
            <DataTable
              columns={[
                { key: "category", label: "Category" },
                { key: "description", label: "Description" },
                { key: "amount", label: "Amount", render: (r) => `₹ ${r.amount.toLocaleString("en-IN")}` },
              ]}
              rows={expenses}
            />
          </div>
        </div>
      </div>
    </>
  );
}
