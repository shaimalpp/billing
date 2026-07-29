import { useEffect, useState } from "react";
import api from "../api/axios";
import Topbar from "../components/Topbar.jsx";
import DataTable from "../components/DataTable.jsx";

export default function EmployeeAssignment() {
  const [jobs, setJobs] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [workRate, setWorkRate] = useState("");
  const [customers, setCustomers] = useState([]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobForm, setJobForm] = useState({ title: "", customer: "", type: "Electrical" });
  const [showEmpForm, setShowEmpForm] = useState(false);
  const [empForm, setEmpForm] = useState({ name: "", phone: "", role: "Technician", hourlyRate: "" });

  const load = () => api.get("/jobs").then((res) => setJobs(res.data));
  const loadEmployees = () => api.get("/employees").then((res) => setEmployees(res.data));

  useEffect(() => {
    load();
    loadEmployees();
    api.get("/customers").then((res) => setCustomers(res.data));
  }, []);

  const createEmployee = async (e) => {
    e.preventDefault();
    if (!empForm.name) return;
    await api.post("/employees", { ...empForm, hourlyRate: Number(empForm.hourlyRate) || 0 });
    setEmpForm({ name: "", phone: "", role: "Technician", hourlyRate: "" });
    setShowEmpForm(false);
    loadEmployees();
  };

  const createJob = async (e) => {
    e.preventDefault();
    if (!jobForm.title || !jobForm.customer) return;
    await api.post("/jobs", jobForm);
    setJobForm({ title: "", customer: "", type: "Electrical" });
    setShowJobForm(false);
    load();
  };

  const currentJob = jobs.find((j) => j._id === selectedJob);

  const assign = async (e) => {
    e.preventDefault();
    if (!selectedJob || !selectedEmployee) return;
    const existing = (currentJob?.assignedEmployees || []).map((a) => ({
      employee: a.employee?._id || a.employee,
      workRate: a.workRate,
    }));
    const updated = [...existing, { employee: selectedEmployee, workRate: Number(workRate) || 0 }];
    await api.put(`/jobs/${selectedJob}/assign`, { assignedEmployees: updated });
    setSelectedEmployee("");
    setWorkRate("");
    load();
  };

  return (
    <>
      <Topbar
        title="Employee Assignment"
        subtitle="Assign employees and set work rates · Malayalam: ജീവനക്കാരെ ജോലിക്ക് നിയോഗിക്കാം"
      />
      <div className="page-body">
        <div className="card">
          <div className="card-header">
            <h3>Jobs</h3>
            <button className="btn btn-primary" onClick={() => setShowJobForm(!showJobForm)}>
              {showJobForm ? "Cancel" : "+ New Job"}
            </button>
          </div>
          {showJobForm && (
            <form onSubmit={createJob}>
              <div className="form-row">
                <div className="form-group">
                  <label>Job Title</label>
                  <input
                    required
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Customer</label>
                  <select
                    required
                    value={jobForm.customer}
                    onChange={(e) => setJobForm({ ...jobForm, customer: e.target.value })}
                  >
                    <option value="">Select customer</option>
                    {customers.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 14, maxWidth: 220 }}>
                <label>Job Type</label>
                <select
                  value={jobForm.type}
                  onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                >
                  <option value="Electrical">Electrical</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Both">Both</option>
                </select>
              </div>
              <button type="submit" className="btn btn-green">
                Save Job
              </button>
            </form>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Employees</h3>
            <button className="btn btn-primary" onClick={() => setShowEmpForm(!showEmpForm)}>
              {showEmpForm ? "Cancel" : "+ New Employee"}
            </button>
          </div>
          {showEmpForm && (
            <form onSubmit={createEmployee}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    required
                    value={empForm.name}
                    onChange={(e) => setEmpForm({ ...empForm, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    value={empForm.phone}
                    onChange={(e) => setEmpForm({ ...empForm, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Role</label>
                  <input
                    value={empForm.role}
                    onChange={(e) => setEmpForm({ ...empForm, role: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Hourly Rate (₹)</label>
                  <input
                    type="number"
                    value={empForm.hourlyRate}
                    onChange={(e) => setEmpForm({ ...empForm, hourlyRate: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-green">
                Save Employee
              </button>
            </form>
          )}
          <DataTable
            columns={[
              { key: "name", label: "Name" },
              { key: "phone", label: "Phone" },
              { key: "role", label: "Role" },
              { key: "hourlyRate", label: "Hourly Rate", render: (r) => `₹ ${r.hourlyRate || 0}` },
            ]}
            rows={employees}
          />
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Assign Employee & Set Work Rate</h3>
          </div>
          <form onSubmit={assign}>
            <div className="form-row">
              <div className="form-group">
                <label>Job</label>
                <select
                  required
                  value={selectedJob}
                  onChange={(e) => setSelectedJob(e.target.value)}
                >
                  <option value="">Select job</option>
                  {jobs.map((j) => (
                    <option key={j._id} value={j._id}>
                      {j.title} - {j.customer?.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Employee</label>
                <select
                  required
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                >
                  <option value="">Select employee</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 14, maxWidth: 220 }}>
              <label>Work Rate (₹ / day)</label>
              <input
                type="number"
                required
                value={workRate}
                onChange={(e) => setWorkRate(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-green">
              Assign
            </button>
          </form>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Job Assignments</h3>
          </div>
          <DataTable
            columns={[
              { key: "title", label: "Job" },
              { key: "customer", label: "Customer", render: (r) => r.customer?.name || "-" },
              {
                key: "assigned",
                label: "Assigned Employees & Rates",
                render: (r) =>
                  (r.assignedEmployees || [])
                    .map((a) => `${a.employee?.name || "-"} (₹${a.workRate}/day)`)
                    .join(", ") || "-",
              },
            ]}
            rows={jobs}
          />
        </div>
      </div>
    </>
  );
}
