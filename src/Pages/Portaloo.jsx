import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const STATUS_OPTIONS = ["unrented", "rented", "maintenance", "collected"];
const PAYMENT_OPTIONS = ["paid", "unpaid"];

function Portaloo() {
  const [portaloosCount, setPortaloosCount] = useState({ rented: 0, unrented: 0 });
  const [dueForCollection, setDueForCollection] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [portalooData, setPortalooData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch dashboard data on mount and after save
  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    // Counts and due collection same as before...
    // (copy the dashboard fetch code here)
    const { data: rentedData } = await supabase
      .from("portaloos")
      .select("id", { count: "exact" })
      .eq("status", "rented");

    const { data: unrentedData } = await supabase
      .from("portaloos")
      .select("id", { count: "exact" })
      .eq("status", "unrented");

    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

    const { data: dueData } = await supabase
      .from("portaloos")
      .select("*")
      .lte("next_collection", twoDaysFromNow.toISOString())
      .gte("next_collection", new Date().toISOString())
      .order("next_collection", { ascending: true });

    setPortaloosCount({ rented: rentedData?.length || 0, unrented: unrentedData?.length || 0 });
    setDueForCollection(dueData || []);
  }

  // When portaloo selected, fetch and set both portalooData & formData
  async function handleSelectNumber(num) {
    setSelectedNumber(num);
    setLoading(true);

    let { data, error } = await supabase
      .from("portaloos")
      .select("*")
      .eq("id", num)
      .single();

    if (error && error.code === "PGRST116") {
      const { data: createdData, error: createError } = await supabase
        .from("portaloos")
        .insert([
          {
            id: num,
            status: "unrented",
            location: "",
            next_collection: null,
            price: 0,
            payment_status: "unpaid",
          },
        ])
        .select()
        .single();

      if (createError) {
        alert("Error creating portaloo: " + createError.message);
        setPortalooData(null);
        setLoading(false);
        return;
      } else {
        data = createdData;
      }
    } else if (error) {
      alert("Error fetching portaloo: " + error.message);
      setPortalooData(null);
      setLoading(false);
      return;
    }

    setPortalooData(data);
    setFormData(data); // initialize form with data
    setLoading(false);
  }

  // Handle input changes locally in formData
  function handleInputChange(field, value) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // Save formData to supabase
  async function saveChanges() {
    if (!formData) return;
    setSaving(true);
    const { error } = await supabase
      .from("portaloos")
      .update({
        status: formData.status,
        location: formData.location,
        next_collection: formData.next_collection,
        price: formData.price,
        payment_status: formData.payment_status,
      })
      .eq("id", formData.id);

    if (error) {
      alert("Error saving portaloo: " + error.message);
    } else {
      alert("Portaloo saved successfully!");
      setPortalooData(formData);
      fetchDashboardData();
    }
    setSaving(false);
  }

  return (
    <div style={{ maxWidth: 1000, margin: "2rem auto" }}>
      <h2>Portaloo Hire Dashboard</h2>

      {/* Dashboard code (same as before) */}
      <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem" }}>
        <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px", flex: 1 }}>
          <h3>Portaloos Rented</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{portaloosCount.rented}</p>
        </div>
        <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px", flex: 1 }}>
          <h3>Portaloos Available</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{portaloosCount.unrented}</p>
        </div>
      </div>

      {/* Due for collection */}
      <div style={{ marginBottom: "3rem" }}>
        <h3>Portaloos Due for Collection (Next 2 Days)</h3>
        {dueForCollection.length === 0 ? (
          <p>No portaloos due for collection in next 2 days.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0" }}>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>ID</th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Status</th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Location</th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Next Collection</th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Price</th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {dueForCollection.map((p) => (
                <tr key={p.id}>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{p.id}</td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{p.status}</td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{p.location || "—"}</td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                    {p.next_collection ? new Date(p.next_collection).toLocaleDateString() : "—"}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                    £{p.price?.toFixed(2) || "0.00"}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{p.payment_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Select portaloo */}
      <div style={{ marginBottom: "2rem" }}>
        <label htmlFor="portalooNumber">Select Portaloo Number (1-300): </label>
        <select
          id="portalooNumber"
          value={selectedNumber || ""}
          onChange={(e) => handleSelectNumber(parseInt(e.target.value))}
        >
          <option value="">-- Select --</option>
          {[...Array(300)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>

      {/* Editable form */}
      {loading ? (
        <p>Loading portaloo data...</p>
      ) : formData ? (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "1rem",
            borderRadius: "8px",
            maxWidth: 600,
          }}
        >
          <h3>Portaloo #{formData.id} Details</h3>
          <div style={{ marginBottom: "1rem" }}>
            <label>Status: </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>Location: </label>
            <input
              type="text"
              value={formData.location || ""}
              onChange={(e) => handleInputChange("location", e.target.value)}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>Next Collection Date: </label>
            <input
              type="date"
              value={
                formData.next_collection
                  ? new Date(formData.next_collection).toISOString().slice(0, 10)
                  : ""
              }
              onChange={(e) => handleInputChange("next_collection", e.target.value)}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>Price (£): </label>
            <input
              type="number"
              value={formData.price || 0}
              min="0"
              step="0.01"
              onChange={(e) => handleInputChange("price", parseFloat(e.target.value))}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>Payment Status: </label>
            <select
              value={formData.payment_status}
              onChange={(e) => handleInputChange("payment_status", e.target.value)}
            >
              {PAYMENT_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button onClick={saveChanges} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      ) : (
        <p>Please select a portaloo number above to view or edit its data.</p>
      )}
    </div>
  );
}

export default Portaloo;
