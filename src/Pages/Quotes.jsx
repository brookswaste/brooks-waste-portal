import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const STATUS_COLORS = {
  pending: "#f39c12",
  accepted: "#27ae60",
  rejected: "#c0392b",
};

const STATUS_OPTIONS = ["pending", "accepted", "rejected"];

function Quotes() {
  const [quotes, setQuotes] = useState([]);
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Form state
  const [newQuote, setNewQuote] = useState({
    customer_name: "",
    quote_value: "",
    status: "pending",
    sales_person: "",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch all quotes from Supabase
  useEffect(() => {
    fetchQuotes();
  }, []);

  async function fetchQuotes() {
    setLoading(true);
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      alert("Error loading quotes: " + error.message);
    } else {
      setQuotes(data);
      setFilteredQuotes(data);
    }
    setLoading(false);
  }

  // Filter and search quotes
  useEffect(() => {
    let filtered = quotes;

    if (statusFilter) {
      filtered = filtered.filter((q) => q.status === statusFilter);
    }

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (q) =>
          q.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (q.id && q.id.toString().includes(searchTerm))
      );
    }

    setFilteredQuotes(filtered);
  }, [statusFilter, searchTerm, quotes]);

  // Compute summary stats
  const totalQuotes = quotes.length;
  const pendingCount = quotes.filter((q) => q.status === "pending").length;
  const acceptedCount = quotes.filter((q) => q.status === "accepted").length;
  const rejectedCount = quotes.filter((q) => q.status === "rejected").length;
  const totalValue = quotes.reduce((sum, q) => sum + (q.quote_value || 0), 0);

  // Handle form input change
  function handleInputChange(e) {
    const { name, value } = e.target;
    setNewQuote((prev) => ({ ...prev, [name]: value }));
  }

  // Handle form submit
  async function handleSubmit(e) {
    e.preventDefault();
    if (!newQuote.customer_name || !newQuote.quote_value) {
      alert("Please fill in required fields");
      return;
    }

    setSaving(true);
    const { data, error } = await supabase.from("quotes").insert([
      {
        customer_name: newQuote.customer_name,
        quote_value: parseFloat(newQuote.quote_value),
        status: newQuote.status,
        sales_person: newQuote.sales_person,
      },
    ]);

    if (error) {
      alert("Error adding quote: " + error.message);
    } else {
      alert("Quote added successfully!");
      setNewQuote({
        customer_name: "",
        quote_value: "",
        status: "pending",
        sales_person: "",
      });
      fetchQuotes(); // refresh quotes list
    }
    setSaving(false);
  }

  return (
    <div style={{ maxWidth: 1200, margin: "2rem auto", padding: "0 1rem" }}>
      <h2>Quotes Dashboard</h2>

      {/* New Quote Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: "2rem",
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h3>Add New Quote</h3>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Customer Name*:<br />
            <input
              type="text"
              name="customer_name"
              value={newQuote.customer_name}
              onChange={handleInputChange}
              required
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Quote Value (£)*:<br />
            <input
              type="number"
              name="quote_value"
              value={newQuote.quote_value}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Status:<br />
            <select
              name="status"
              value={newQuote.status}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "0.5rem" }}
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Sales Person:<br />
            <input
              type="text"
              name="sales_person"
              value={newQuote.sales_person}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </label>
        </div>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Add Quote"}
        </button>
      </form>

      {/* Summary cards */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <div style={summaryCardStyle}>
          <h3>Total Quotes</h3>
          <p style={summaryNumberStyle}>{totalQuotes}</p>
        </div>
        <div style={{ ...summaryCardStyle, backgroundColor: STATUS_COLORS.pending }}>
          <h3>Pending</h3>
          <p style={summaryNumberStyle}>{pendingCount}</p>
        </div>
        <div style={{ ...summaryCardStyle, backgroundColor: STATUS_COLORS.accepted }}>
          <h3>Accepted</h3>
          <p style={summaryNumberStyle}>{acceptedCount}</p>
        </div>
        <div style={{ ...summaryCardStyle, backgroundColor: STATUS_COLORS.rejected }}>
          <h3>Rejected</h3>
          <p style={summaryNumberStyle}>{rejectedCount}</p>
        </div>
        <div style={summaryCardStyle}>
          <h3>Total Value</h3>
          <p style={summaryNumberStyle}>£{totalValue.toFixed(2)}</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: "1rem" }}>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
        <input
          type="text"
          placeholder="Search by customer or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginLeft: "1rem" }}
        />
      </div>

      {/* Quotes table */}
      {loading ? (
        <p>Loading quotes...</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Customer</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Quote Value</th>
              <th style={thStyle}>Sales Person</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuotes.map((quote) => (
              <tr key={quote.id}>
                <td style={tdStyle}>{quote.id}</td>
                <td style={tdStyle}>{quote.customer_name}</td>
                <td style={tdStyle}>{new Date(quote.created_at).toLocaleDateString()}</td>
                <td style={{ ...tdStyle, color: STATUS_COLORS[quote.status] || "black", fontWeight: "bold" }}>
                  {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                </td>
                <td style={tdStyle}>£{quote.quote_value?.toFixed(2) || "0.00"}</td>
                <td style={tdStyle}>{quote.sales_person || "—"}</td>
                <td style={tdStyle}>
                  {/* Placeholder for action buttons like View/Edit */}
                  <button onClick={() => alert(`View/Edit Quote ID ${quote.id}`)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const summaryCardStyle = {
  backgroundColor: "#ddd",
  flex: 1,
  borderRadius: "8px",
  padding: "1rem",
  textAlign: "center",
};

const summaryNumberStyle = {
  fontSize: "2rem",
  fontWeight: "bold",
  margin: 0,
};

const thStyle = {
  border: "1px solid #ccc",
  padding: "0.5rem",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "0.5rem",
};

export default Quotes;
