export default function StatCard({ icon, label, value, color = "#2563eb" }) {
  return (
    <div className="stat-card">
      <div className="icon-badge" style={{ background: color }}>
        {icon}
      </div>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
      </div>
    </div>
  );
}
