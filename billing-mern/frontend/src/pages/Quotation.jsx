import { useEffect, useState } from "react";
import api from "../api/axios";
import Topbar from "../components/Topbar.jsx";
import DataTable from "../components/DataTable.jsx";

const emptyCharge = () => ({ description: "", amount: 0 });

export default function Quotation() {
  const [quotations, setQuotations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [customer, setCustomer] = useState("");
  const [materialCharges, setMaterialCharges] = useState([emptyCharge()]);
  const [labourCharges, setLabourCharges] = useState([emptyCharge()]);
  const [otherCharges, setOtherCharges] = useState([emptyCharge()]);

  const load = () => api.get("/quotations").then((res) => setQuotations(res.data));

  useEffect(() => {
    load();
    api.get("/customers").then((res) => setCustomers(res.data));
  }, []);

  const sum = (arr) => arr.reduce((s, i) => s + (Number(i.amount) || 0), 0);
  const total = sum(materialCharges) + sum(labourCharges) + sum(otherCharges);

  const updateRow = (setter, arr, idx, field, value) => {
    const copy = [...arr];
    copy[idx] = { ...copy[idx], [field]: value };
    setter(copy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customer) return;
    await api.post("/quotations", {
      customer,
      materialCharges,
      labourCharges,
      otherCharges,
    });
    setCustomer("");
    setMaterialCharges([emptyCharge()]);
    setLabourCharges([emptyCharge()]);
    setOtherCharges([emptyCharge()]);
    setShowForm(false);
    load();
  };

  const renderChargeSection = (title, arr, setter) => (
    <>
      <div className="section-title">{title}</div>
      {arr.map((row, idx) => (
        <div className="charge-row" key={idx}>
          <input
            placeholder="Description"
            value={row.description}
            onChange={(e) => updateRow(setter, arr, idx, "description", e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            value={row.amount}
            onChange={(e) => updateRow(setter, arr, idx, "amount", e.target.value)}
          />
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => setter(arr.filter((_, i) => i !== idx))}
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-outline btn-sm"
        onClick={() => setter([...arr, emptyCharge()])}
      >
        + Add row
      </button>
    </>
  );

  return (
    <>
      <Topbar
        title="Quotation"
        subtitle="Create quotations with material, labour and other charges · Malayalam: ക്വട്ടേഷൻ തയ്യാറാക്കാം"
      />
      <div className="page-body">
        <div className="card">
          <div className="card-header">
            <h3>Net Profit (Approx): ₹ {total.toLocaleString("en-IN")}</h3>
            <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? "Cancel" : "+ Create Quotation"}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label>Customer</label>
                <select required value={customer} onChange={(e) => setCustomer(e.target.value)}>
                  <option value="">Select customer</option>
                  {customers.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {renderChargeSection("Material Charges", materialCharges, setMaterialCharges)}
              {renderChargeSection("Labour Charges", labourCharges, setLabourCharges)}
              {renderChargeSection("Other Charges", otherCharges, setOtherCharges)}

              <div style={{ margin: "16px 0", fontWeight: 700 }}>
                Total: ₹ {total.toLocaleString("en-IN")}
              </div>
              <button type="submit" className="btn btn-green">
                Save Quotation
              </button>
            </form>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Quotations</h3>
          </div>
          <DataTable
            columns={[
              { key: "customer", label: "Customer", render: (r) => r.customer?.name || "-" },
              {
                key: "totalAmount",
                label: "Total Amount",
                render: (r) => `₹ ${(r.totalAmount || 0).toLocaleString("en-IN")}`,
              },
              {
                key: "status",
                label: "Status",
                render: (r) => <span className="badge blue">{r.status}</span>,
              },
              {
                key: "createdAt",
                label: "Date",
                render: (r) => new Date(r.createdAt).toLocaleDateString("en-GB"),
              },
            ]}
            rows={quotations}
          />
        </div>
      </div>
    </>
  );
}
