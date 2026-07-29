export default function Topbar({ title, subtitle }) {
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <header className="topbar">
      <div>
        <h1>{title}</h1>
        {subtitle && (
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{subtitle}</div>
        )}
      </div>
      <div className="topbar-right">
        <span>{today}</span>
        <span>Admin</span>
      </div>
    </header>
  );
}
