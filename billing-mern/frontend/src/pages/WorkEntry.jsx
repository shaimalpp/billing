import { useEffect, useState } from "react";
import api from "../api/axios";
import Topbar from "../components/Topbar.jsx";
import DataTable from "../components/DataTable.jsx";

export default function WorkEntry() {
  const [entries, setEntries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    employee: "",
    job: "",
    date: new Date().toISOString().slice(0, 10),
    hours: 8,
    overtimeHours: 0,
    rate: 0,
  });

  const load = () => api.get("/workentries").then((res) => setEntries(res.data));

  useEffect(() => {
    load();
    api.get("/employees").then((res) => setEmployees(res.data));
    api.get("/jobs").then((res) => setJobs(res.data));
  }, []);

  const totalToday = entries.reduce((s, e) => s + (e.amount || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/workentries", form);
    setForm({ ...form, hours: 8, overtimeHours: 0 });
    load();
  };

  return (
    <>
      <Topbar
        title="Work Entry"
        subtitle="Record work hours and overtime · Malayalam: ജോലി സമയം രേഖപ്പെടുത്തുക"
      />
      <div className="page-body">
        <div className="stat-cards">
          <div className="stat-card">
            <div className="icon-badge" style={{ background: "#2563eb" }}>
              ⏱️
            </div>
            <div>
              <div className="stat-label">Total Paid (All Entries)</div>
              <div className="stat-value">₹ {totalToday.toLocaleString("en-IN")}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>New Work Entry</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Employee</label>
                <select
                  required
                  value={form.employee}
                  onChange={(e) => setForm({ ...form, employee: e.target.value })}
                >
                  <option value="">Select employee</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Job</label>
                <select value={form.job} onChange={(e) => setForm({ ...form, job: e.target.value })}>
                  <option value="">Select job (optional)</option>
                  {jobs.map((j) => (
                    <option key={j._id} value={j._id}>
                      {j.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Rate (₹/hour)</label>
                <input
                  type="number"
                  value={form.rate}
                  onChange={(e) => setForm({ ...form, rate: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Hours Worked</label>
                <input
                  type="number"
                  value={form.hours}
                  onChange={(e) => setForm({ ...form, hours: Number(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label>Overtime Hours</label>
                <input
                  type="number"
                  value={form.overtimeHours}
                  onChange={(e) => setForm({ ...form, overtimeHours: Number(e.target.value) })}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-green">
              Save Entry
            </button>
          </form>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Work Entries</h3>
          </div>
          <DataTable
            columns={[
              { key: "employee", label: "Employee", render: (r) => r.employee?.name || "-" },
              { key: "job", label: "Job", render: (r) => r.job?.title || "-" },
              { key: "date", label: "Date", render: (r) => new Date(r.date).toLocaleDateString("en-GB") },
              { key: "hours", label: "Hours" },
              { key: "overtimeHours", label: "OT Hours" },
              { key: "amount", label: "Amount", render: (r) => `₹ ${(r.amount || 0).toLocaleString("en-IN")}` },
            ]}
            rows={entries}
          />
        </div>
      </div>
    </>
  );
}
