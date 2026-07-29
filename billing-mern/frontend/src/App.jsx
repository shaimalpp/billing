import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import RecentJobs from "./pages/RecentJobs.jsx";
import Customers from "./pages/Customers.jsx";
import Quotation from "./pages/Quotation.jsx";
import EmployeeAssignment from "./pages/EmployeeAssignment.jsx";
import WorkEntry from "./pages/WorkEntry.jsx";
import Expenses from "./pages/Expenses.jsx";
import Invoice from "./pages/Invoice.jsx";
import ProfitAnalysis from "./pages/ProfitAnalysis.jsx";
import SalarySummary from "./pages/SalarySummary.jsx";
import Reports from "./pages/Reports.jsx";
import Settings from "./pages/Settings.jsx";

export default function App() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/recent-jobs" element={<RecentJobs />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/quotation" element={<Quotation />} />
          <Route path="/employee-assignment" element={<EmployeeAssignment />} />
          <Route path="/work-entry" element={<WorkEntry />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/profit-analysis" element={<ProfitAnalysis />} />
          <Route path="/salary-summary" element={<SalarySummary />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}
