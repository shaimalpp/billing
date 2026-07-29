import { useEffect, useState } from "react";
import api from "../api/axios";
import Topbar from "../components/Topbar.jsx";
import DataTable from "../components/DataTable.jsx";

const categories = ["Fuel", "Food", "Travel", "Material", "Other"];

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    category: "Fuel",
    description: "",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const load = () => api.get("/expenses").then((res) => setExpenses(res.data));

  useEffect(() => {
    load();
  }, []);

  const total = expenses.reduce((s, e) => s + (e.amount || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/expenses", { ...form, amount: Number(form.amount) });
    setForm({ ...form, description: "", amount: "" });
    load();
  };

  return (
    <>
      <Topbar
        title="Expenses"
        subtitle="Track fuel, food, travel and material expenses · Malayalam: ചെലവുകൾ രേഖപ്പെടുത്തുക"
      />
      <div className="page-body">
        <div className="stat-cards">
          <div className="stat-card">
            <div className="icon-badge" style={{ background: "#dc2626" }}>
              💳
            </div>
            <div>
              <div className="stat-label">Total Expenses (All Time)</div>
              <div className="stat-value">₹ {total.toLocaleString("en-IN")}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Add Expense</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Description</label>
                <input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-green">
              Save Expense
            </button>
          </form>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Expense List</h3>
          </div>
          <DataTable
            columns={[
              {
                key: "category",
                label: "Category",
                render: (r) => <span className="badge orange">{r.category}</span>,
              },
              { key: "description", label: "Description" },
              { key: "date", label: "Date", render: (r) => new Date(r.date).toLocaleDateString("en-GB") },
              { key: "amount", label: "Amount", render: (r) => `₹ ${(r.amount || 0).toLocaleString("en-IN")}` },
            ]}
            rows={expenses}
          />
        </div>
      </div>
    </>
  );
}
