import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const STATUS_OPTIONS = ["unpaid", "paid", "overdue", "pending"];

function Accounts() {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [statusFilter, setStatusFilter] = useState("unpaid");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state for new invoice
  const [newInvoice, setNewInvoice] = useState({
    client: "",
    job: "",
    postcode: "",
    details: "",
    status: "unpaid",
    notes: "",
    follow_up_date: "",
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    filterInvoices();
  }, [statusFilter, invoices]);

  async function fetchInvoices() {
    setLoading(true);
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .order("follow_up_date", { ascending: true });
    if (error) {
      alert("Error loading invoices: " + error.message);
    } else {
      setInvoices(data);
    }
    setLoading(false);
  }

  function filterInvoices() {
    if (statusFilter === "") {
      setFilteredInvoices(invoices);
    } else {
      setFilteredInvoices(invoices.filter((inv) => inv.status === statusFilter));
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setNewInvoice((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!newInvoice.client || !newInvoice.job || !newInvoice.status) {
      alert("Please fill in required fields: Client, Job, Status");
      return;
    }
    setSaving(true);
    const { data, error } = await supabase.from("invoices").insert([
      {
        client: newInvoice.client,
        job: newInvoice.job,
        postcode: newInvoice.postcode,
        details: newInvoice.details,
        status: newInvoice.status,
        notes: newInvoice.notes,
        follow_up_date: newInvoice.follow_up_date || null,
      },
    ]);
    if (error) {
      alert("Error adding invoice: " + error.message);
    } else {
      alert("Invoice added!");
      setNewInvoice({
        client: "",
        job: "",
        postcode: "",
        details: "",
        status: "unpaid",
        notes: "",
        follow_up_date: "",
      });
      fetchInvoices();
    }
    setSaving(false);
  }

  // Count unpaid invoices for dashboard
  const unpaidCount = invoices.filter((inv) => inv.status === "unpaid").length;

  return (
    <div style={{ maxWidth: 1100, margin: "2rem auto", padding: "0 1rem" }}>
      <h2>Accounts Dashboard</h2>

      {/* Dashboard summary */}
      <div
        style={{
          padding: "1rem",
          marginBottom: "2rem",
          backgroundColor: "#e9ecef",
          borderRadius: "8px",
          fontSize: "1.2rem",
          fontWeight: "bold",
        }}
      >
        Total Unpaid Invoices: {unpaidCount}
      </div>

      {/* New invoice form */}
      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: "2rem",
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h3>Add New Invoice</h3>

        <label>
          Client*:<br />
          <input
            type="text"
            name="client"
            value={newInvoice.client}
            onChange={handleInputChange}
            required
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />
        </label>

        <label>
          Job*:<br />
          <input
            type="text"
            name="job"
            value={newInvoice.job}
            onChange={handleInputChange}
            required
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />
        </label>

        <label>
          Postcode:<br />
          <input
            type="text"
            name="postcode"
            value={newInvoice.postcode}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />
        </label>

        <label>
          Details:<br />
          <textarea
            name="details"
            value={newInvoice.details}
            onChange={handleInputChange}
            rows={3}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />
        </label>

        <label>
          Status*:<br />
          <select
            name="status"
            value={newInvoice.status}
            onChange={handleInputChange}
            required
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          >
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="pending">Pending</option>
          </select>
        </label>

        <label>
          Notes:<br />
          <textarea
            name="notes"
            value={newInvoice.notes}
            onChange={handleInputChange}
            rows={2}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />
        </label>

        <label>
          Follow-up Date:<br />
          <input
            type="date"
            name="follow_up_date"
            value={newInvoice.follow_up_date}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />
        </label>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Add Invoice"}
        </button>
      </form>

      {/* Filter */}
      <div style={{ marginBottom: "1rem" }}>
        <label>
          Filter by Status:{" "}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="pending">Pending</option>
            <option value="">All</option>
          </select>
        </label>
      </div>

      {/* Invoice List */}
      {loading ? (
        <p>Loading invoices...</p>
      ) : filteredInvoices.length === 0 ? (
        <p>No invoices found.</p>
      ) : (
        <table
          style={{ width: "100%", borderCollapse: "collapse" }}
          aria-label="Invoices List"
        >
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th style={thStyle}>Client</th>
              <th style={thStyle}>Job</th>
              <th style={thStyle}>Postcode</th>
              <th style={thStyle}>Details</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Notes</th>
              <th style={thStyle}>Follow-up Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((inv) => (
              <tr key={inv.id}>
                <td style={tdStyle}>{inv.client}</td>
                <td style={tdStyle}>{inv.job}</td>
                <td style={tdStyle}>{inv.postcode || "—"}</td>
                <td style={tdStyle}>{inv.details || "—"}</td>
                <td style={tdStyle}>{inv.status}</td>
                <td style={tdStyle}>{inv.notes || "—"}</td>
                <td style={tdStyle}>
                  {inv.follow_up_date
                    ? new Date(inv.follow_up_date).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = {
  border: "1px solid #ccc",
  padding: "0.5rem",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "0.5rem",
};

export default Accounts;
