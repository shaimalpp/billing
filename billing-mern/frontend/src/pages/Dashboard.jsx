import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import api from "../api/axios";
import Topbar from "../components/Topbar.jsx";
import StatCard from "../components/StatCard.jsx";
import DataTable from "../components/DataTable.jsx";

const COLORS = ["#2563eb", "#16a34a", "#f97316", "#7c3aed", "#dc2626"];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const pieData = data
    ? Object.entries(data.expenseByCategory || {}).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <>
      <Topbar
        title="Dashboard"
        subtitle="View total customers, active jobs, employees, billing and pending balances · Malayalam: മൊത്തം വിവരങ്ങൾ ഒറ്റനോട്ടത്തിൽ കാണാം"
      />
      <div className="page-body">
        {loading ? (
          <div className="empty-state">Loading dashboard...</div>
        ) : (
          <>
            <div className="stat-cards">
              <StatCard icon="👥" label="Total Customers" value={data?.totalCustomers ?? 0} color="#2563eb" />
              <StatCard icon="🛠️" label="Active Jobs" value={data?.activeJobs ?? 0} color="#16a34a" />
              <StatCard icon="🧑‍🔧" label="Employees" value={data?.totalEmployees ?? 0} color="#f97316" />
              <StatCard
                icon="₹"
                label="Billing (This Month)"
                value={`₹ ${(data?.totalBillingThisMonth ?? 0).toLocaleString("en-IN")}`}
                color="#7c3aed"
              />
            </div>

            <div className="grid-2">
              <div className="card">
                <div className="card-header">
                  <h3>Profit Summary (This Month)</h3>
                </div>
                <DataTable
                  columns={[
                    { key: "label", label: "" },
                    { key: "value", label: "Amount" },
                  ]}
                  rows={[
                    { label: "Total Billing", value: `₹ ${(data?.totalBillingThisMonth ?? 0).toLocaleString("en-IN")}` },
                    { label: "Total Expenses", value: `₹ ${(data?.totalExpensesThisMonth ?? 0).toLocaleString("en-IN")}` },
                    { label: "Net Profit", value: `₹ ${(data?.totalProfitThisMonth ?? 0).toLocaleString("en-IN")}` },
                    { label: "Pending Jobs", value: data?.pendingJobs ?? 0 },
                  ]}
                />
              </div>

              <div className="card">
                <div className="card-header">
                  <h3>Expense Summary (This Month)</h3>
                </div>
                {pieData.length === 0 ? (
                  <div className="empty-state">No expenses recorded this month</div>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Recent Jobs</h3>
              </div>
              <DataTable
                columns={[
                  { key: "title", label: "Job" },
                  { key: "customer", label: "Customer", render: (r) => r.customer?.name || "-" },
                  { key: "type", label: "Type" },
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
                rows={data?.recentJobs}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
