import { useEffect, useState } from "react";
import api from "../api/axios";
import Topbar from "../components/Topbar.jsx";
import DataTable from "../components/DataTable.jsx";

export default function SalarySummary() {
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    api.get("/reports/salary-summary").then((res) => setSummary(res.data));
  }, []);

  const totalPay = summary.reduce((s, e) => s + (e.totalPay || 0), 0);

  return (
    <>
      <Topbar
        title="Salary Summary"
        subtitle="View employee working hours and salary · Malayalam: ജീവനക്കാരുടെ ശമ്പളം കാണാം"
      />
      <div className="page-body">
        <div className="stat-cards">
          <div className="stat-card">
            <div className="icon-badge" style={{ background: "#7c3aed" }}>
              💰
            </div>
            <div>
              <div className="stat-label">Total Salary Payable</div>
              <div className="stat-value">₹ {totalPay.toLocaleString("en-IN")}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Employee Salary Summary</h3>
            <button className="btn btn-primary btn-sm">Pay Salary (Print Slip)</button>
          </div>
          <DataTable
            columns={[
              { key: "employee", label: "Employee" },
              { key: "totalHours", label: "Total Hours" },
              { key: "overtimeHours", label: "OT Hours" },
              { key: "totalPay", label: "Total Pay", render: (r) => `₹ ${r.totalPay.toLocaleString("en-IN")}` },
            ]}
            rows={summary}
          />
        </div>
      </div>
    </>
  );
}
