import { useEffect, useState } from "react";
import api from "../api/axios";
import Topbar from "../components/Topbar.jsx";
import DataTable from "../components/DataTable.jsx";

export default function Invoice() {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    customer: "",
    job: "",
    totalAmount: "",
    totalCost: "",
  });

  const load = () => api.get("/invoices").then((res) => setInvoices(res.data));

  useEffect(() => {
    load();
    api.get("/customers").then((res) => setCustomers(res.data));
    api.get("/jobs").then((res) => setJobs(res.data));
  }, []);

  const totalProfit = invoices.reduce((s, i) => s + (i.profit || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/invoices", {
      customer: form.customer,
      job: form.job || undefined,
      totalAmount: Number(form.totalAmount),
      totalCost: Number(form.totalCost),
    });
    setForm({ customer: "", job: "", totalAmount: "", totalCost: "" });
    load();
  };

  return (
    <>
      <Topbar
        title="Invoice"
        subtitle="Generate and print customer invoices · Malayalam: ബിൽ തയ്യാറാക്കി PDF എടുക്കാം"
      />
      <div className="page-body">
        <div className="grid-2">
          <div className="card">
            <div className="card-header">
              <h3>Generate Invoice</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label>Customer</label>
                <select
                  required
                  value={form.customer}
                  onChange={(e) => setForm({ ...form, customer: e.target.value })}
                >
                  <option value="">Select customer</option>
                  {customers.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label>Job (optional)</label>
                <select value={form.job} onChange={(e) => setForm({ ...form, job: e.target.value })}>
                  <option value="">Select job</option>
                  {jobs.map((j) => (
                    <option key={j._id} value={j._id}>
                      {j.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Total Bill Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={form.totalAmount}
                    onChange={(e) => setForm({ ...form, totalAmount: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Total Cost / Expense (₹)</label>
                  <input
                    type="number"
                    required
                    value={form.totalCost}
                    onChange={(e) => setForm({ ...form, totalCost: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-green">
                Generate Invoice
              </button>
            </form>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Profit Calculation</h3>
            </div>
            <DataTable
              columns={[
                { key: "label", label: "" },
                { key: "value", label: "" },
              ]}
              rows={[
                { label: "Total Invoices", value: invoices.length },
                {
                  label: "Total Billed",
                  value: `₹ ${invoices.reduce((s, i) => s + (i.totalAmount || 0), 0).toLocaleString("en-IN")}`,
                },
                { label: "Total Profit", value: `₹ ${totalProfit.toLocaleString("en-IN")}` },
              ]}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Invoices</h3>
          </div>
          <DataTable
            columns={[
              { key: "invoiceNumber", label: "Invoice #" },
              { key: "customer", label: "Customer", render: (r) => r.customer?.name || "-" },
              { key: "totalAmount", label: "Amount", render: (r) => `₹ ${(r.totalAmount || 0).toLocaleString("en-IN")}` },
              { key: "profit", label: "Profit", render: (r) => `₹ ${(r.profit || 0).toLocaleString("en-IN")}` },
              {
                key: "status",
                label: "Status",
                render: (r) => (
                  <span className={`badge ${r.status === "paid" ? "green" : "orange"}`}>{r.status}</span>
                ),
              },
              {
                key: "actions",
                label: "",
                render: () => (
                  <button className="btn btn-outline btn-sm" onClick={() => window.print()}>
                    Print
                  </button>
                ),
              },
            ]}
            rows={invoices}
          />
        </div>
      </div>
    </>
  );
}
