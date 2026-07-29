export default function DataTable({ columns, rows, emptyText = "No records found" }) {
  if (!rows || rows.length === 0) {
    return <div className="empty-state">{emptyText}</div>;
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.key}>{c.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={row._id || idx}>
            {columns.map((c) => (
              <td key={c.key}>{c.render ? c.render(row) : row[c.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
