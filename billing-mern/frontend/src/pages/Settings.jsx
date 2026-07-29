import { useEffect, useState } from "react";
import api from "../api/axios";
import Topbar from "../components/Topbar.jsx";

export default function Settings() {
  const [form, setForm] = useState({
    companyName: "",
    tagline: "",
    phone: "",
    email: "",
    expenseCategories: [],
  });
  const [newCategory, setNewCategory] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get("/settings").then((res) => setForm(res.data));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    const res = await api.put("/settings", form);
    setForm(res.data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addCategory = () => {
    if (!newCategory.trim()) return;
    setForm({ ...form, expenseCategories: [...(form.expenseCategories || []), newCategory.trim()] });
    setNewCategory("");
  };

  const removeCategory = (cat) => {
    setForm({
      ...form,
      expenseCategories: form.expenseCategories.filter((c) => c !== cat),
    });
  };

  return (
    <>
      <Topbar
        title="Settings"
        subtitle="Manage company profile and software settings · Malayalam: കമ്പനിയുടെ ക്രമീകരണങ്ങൾ മാറ്റുക"
      />
      <div className="page-body">
        <div className="grid-2">
          <div className="card">
            <div className="card-header">
              <h3>Company Profile</h3>
            </div>
            <form onSubmit={save}>
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label>Company Name</label>
                <input
                  value={form.companyName || ""}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label>Tagline</label>
                <input
                  value={form.tagline || ""}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    value={form.phone || ""}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    value={form.email || ""}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-green">
                Save Changes
              </button>
              {saved && <span style={{ marginLeft: 12, color: "#16a34a", fontSize: 13 }}>Saved!</span>}
            </form>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Expense Categories</h3>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
              {(form.expenseCategories || []).map((cat) => (
                <span key={cat} className="badge blue" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {cat}
                  <button
                    onClick={() => removeCategory(cat)}
                    style={{ border: "none", background: "none", cursor: "pointer", color: "#2563eb" }}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
            <div className="charge-row" style={{ gridTemplateColumns: "1fr auto" }}>
              <input
                placeholder="New category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <button className="btn btn-outline btn-sm" onClick={addCategory} type="button">
                + Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
