import { useEffect, useState } from "react";
import api from "../api/axios";
import Topbar from "../components/Topbar.jsx";
import DataTable from "../components/DataTable.jsx";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });

  const load = () => api.get("/customers").then((res) => setCustomers(res.data));

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/customers", form);
    setForm({ name: "", phone: "", address: "" });
    setShowForm(false);
    load();
  };

  const remove = async (id) => {
    await api.delete(`/customers/${id}`);
    load();
  };

  const totalPending = customers.reduce((s, c) => s + (c.pendingBalance || 0), 0);

  return (
    <>
      <Topbar
        title="Customers"
        subtitle="Manage customer details and customer list · Malayalam: കസ്റ്റമർ വിവരങ്ങൾ കൈകാര്യം ചെയ്യുക"
      />
      <div className="page-body">
        <div className="card">
          <div className="card-header">
            <h3>Pending Balance: ₹ {totalPending.toLocaleString("en-IN")}</h3>
            <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? "Cancel" : "+ Add Customer"}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label>Address</label>
                <input
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-green">
                Save Customer
              </button>
            </form>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Customer List</h3>
          </div>
          <DataTable
            columns={[
              { key: "name", label: "Name" },
              { key: "phone", label: "Phone" },
              { key: "address", label: "Address" },
              {
                key: "pendingBalance",
                label: "Pending Balance",
                render: (r) => `₹ ${(r.pendingBalance || 0).toLocaleString("en-IN")}`,
              },
              {
                key: "actions",
                label: "",
                render: (r) => (
                  <button className="btn btn-outline btn-sm" onClick={() => remove(r._id)}>
                    Delete
                  </button>
                ),
              },
            ]}
            rows={customers}
          />
        </div>
      </div>
    </>
  );
}
