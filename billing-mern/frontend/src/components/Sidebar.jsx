import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", icon: "🏠", end: true },
  { to: "/recent-jobs", label: "Profit & Recent Jobs", icon: "📈" },
  { to: "/customers", label: "Customers", icon: "👥" },
  { to: "/quotation", label: "Quotation", icon: "📝" },
  { to: "/employee-assignment", label: "Employee Assignment", icon: "🧑‍🔧" },
  { to: "/work-entry", label: "Work Entry", icon: "⏱️" },
  { to: "/expenses", label: "Expenses", icon: "💳" },
  { to: "/invoice", label: "Invoice", icon: "🧾" },
  { to: "/profit-analysis", label: "Profit Analysis", icon: "📊" },
  { to: "/salary-summary", label: "Salary Summary", icon: "💰" },
  { to: "/reports", label: "Reports", icon: "📄" },
  { to: "/settings", label: "Settings", icon: "⚙️" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="logo-badge">⚡</div>
        <div className="brand-text">
          <div className="name">EP SERVICES</div>
          <div className="tagline">Electrical & Plumbing</div>
        </div>
      </div>
      <nav>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span>{l.icon}</span>
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
