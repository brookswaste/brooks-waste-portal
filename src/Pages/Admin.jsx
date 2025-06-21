import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient"; // Adjust path if needed

const drivers = [
  "Driver 1", "Driver 2", "Driver 3", "Driver 4",
  "Driver 5", "Driver 6", "Driver 7", "Driver 8",
  "Driver 9", "Driver 10", "Driver 11", "Driver 12",
];

export default function Admin() {
  // Dates for filtering
  const todayDate = new Date();
  const formatDate = (date) => date.toISOString().split("T")[0];
  const todayStr = formatDate(todayDate);
  const yesterdayDate = new Date(todayDate);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = formatDate(yesterdayDate);
  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowStr = formatDate(tomorrowDate);

  // Jobs & filtering
  const [jobs, setJobs] = useState([]);
  const [filterDay, setFilterDay] = useState(todayStr);
  const [loadingJobs, setLoadingJobs] = useState(false);

  // Add/edit form control
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    id: null, // for editing existing jobs
    driver: "",
    date: "",
    type: "",
    postcode: "",
    price: "",
    status: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  // Fetch jobs for the three dates
  async function fetchJobs() {
    setLoadingJobs(true);
    const { data, error } = await supabase
      .from("driver_jobs")
      .select("*")
      .in("date", [yesterdayStr, todayStr, tomorrowStr])
      .order("date", { ascending: true })
      .order("driver", { ascending: true });

    if (error) {
      alert("Error loading jobs: " + error.message);
      console.error(error);
      setJobs([]);
    } else {
      setJobs(data || []);
    }
    setLoadingJobs(false);
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  // Form field change handler
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  // Open add new job form
  function openAddForm() {
    setFormData({
      id: null,
      driver: "",
      date: filterDay,
      type: "",
      postcode: "",
      price: "",
      status: "pending",  // Default status for new jobs
      notes: "",
    });
    setShowAddForm(true);
  }

  // Open edit form with job data
  function openEditForm(job) {
    setFormData({
      id: job.id,
      driver: job.driver,
      date: job.date,
      type: job.type,
      postcode: job.postcode,
      price: job.price,
      status: job.status,
      notes: job.notes,
    });
    setShowAddForm(true);
  }

  // Save (add or update) job
  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.driver || !formData.date || !formData.type) {
      alert("Please fill driver, date, and job type.");
      return;
    }

    setSaving(true);

    let response;
    if (formData.id) {
      // Update existing job
      response = await supabase
        .from("driver_jobs")
        .update({
          driver: formData.driver,
          date: formData.date,
          type: formData.type,
          postcode: formData.postcode,
          price: formData.price,
          status: formData.status,
          notes: formData.notes,
        })
        .eq("id", formData.id);
    } else {
      // Insert new job — remove id field so DB auto-generates it
      const { id, ...dataWithoutId } = formData;
      response = await supabase.from("driver_jobs").insert([dataWithoutId]);
    }

    setSaving(false);

    if (response.error) {
      alert("Error saving job: " + response.error.message);
      console.error(response.error);
    } else {
      alert(`Job ${formData.id ? "updated" : "added"} successfully!`);
      setShowAddForm(false);
      fetchJobs();
    }
  }

  // Delete a job
  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    const { error } = await supabase.from("driver_jobs").delete().eq("id", id);
    if (error) {
      alert("Error deleting job: " + error.message);
    } else {
      alert("Job deleted successfully!");
      fetchJobs();
    }
  }

  // Filter jobs to show only for selected filterDay and sort by numeric driver number
  const jobsToDisplay = jobs
    .filter((job) => job.date === filterDay)
    .sort((a, b) => {
      const numA = parseInt(a.driver.replace("Driver ", ""), 10);
      const numB = parseInt(b.driver.replace("Driver ", ""), 10);
      return numA - numB;
    });

  return (
    <div style={{ maxWidth: 1100, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>Admin Dashboard</h1>

      <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
        <div>
          <button
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: filterDay === yesterdayStr ? "#5b8def" : "#eee",
              color: filterDay === yesterdayStr ? "white" : "#333",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
            onClick={() => setFilterDay(yesterdayStr)}
          >
            {yesterdayStr}
          </button>
          <button
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: filterDay === todayStr ? "#5b8def" : "#eee",
              color: filterDay === todayStr ? "white" : "#333",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginLeft: "0.5rem",
            }}
            onClick={() => setFilterDay(todayStr)}
          >
            Today
          </button>
          <button
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: filterDay === tomorrowStr ? "#5b8def" : "#eee",
              color: filterDay === tomorrowStr ? "white" : "#333",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginLeft: "0.5rem",
            }}
            onClick={() => setFilterDay(tomorrowStr)}
          >
            {tomorrowStr}
          </button>
        </div>

        <button
          onClick={openAddForm}
          style={{
            marginLeft: "auto",
            padding: "0.5rem 1rem",
            borderRadius: "25px",
            backgroundColor: "#5b8def",
            color: "white",
            fontWeight: "600",
            cursor: "pointer",
            border: "none",
            boxShadow: "0 6px 10px rgba(91, 141, 239, 0.4)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#4073d9")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#5b8def")}
        >
          Add New Job
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} style={{ maxWidth: 600, marginBottom: "2rem" }}>
          <h2>{formData.id ? "Edit Job" : "Add New Job"}</h2>

          <label htmlFor="driver">Driver *</label>
          <select
            id="driver"
            name="driver"
            value={formData.driver}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          >
            <option value="" disabled>
              Select a driver
            </option>
            {drivers.map((driver) => (
              <option key={driver} value={driver}>
                {driver}
              </option>
            ))}
          </select>

          <label htmlFor="date">Date *</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />

          <label htmlFor="type">Job Type *</label>
          <input
            type="text"
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />

          <label htmlFor="postcode">Postcode</label>
          <input
            type="text"
            id="postcode"
            name="postcode"
            value={formData.postcode}
            onChange={handleChange}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />

          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />

          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
            required
          >
            <option value="pending">Pending</option>
            <option value="complete">Complete</option>
            <option value="incomplete - issue">Incomplete - Issue</option>
          </select>

          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "0.6rem 1.2rem",
                borderRadius: "25px",
                backgroundColor: "#5b8def",
                color: "white",
                fontWeight: "600",
                fontSize: "1rem",
                cursor: saving ? "not-allowed" : "pointer",
                border: "none",
                boxShadow: "0 6px 10px rgba(91, 141, 239, 0.4)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = saving ? "#5b8def" : "#4073d9")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#5b8def")}
            >
              {saving ? "Saving..." : "Save Job"}
            </button>

            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              style={{
                padding: "0.6rem 1.2rem",
                borderRadius: "25px",
                backgroundColor: "#ccc",
                color: "#333",
                fontWeight: "600",
                fontSize: "1rem",
                cursor: "pointer",
                border: "none",
                boxShadow: "0 6px 10px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#bbb")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#ccc")}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <h2>Jobs for {filterDay}</h2>

      {loadingJobs ? (
        <p>Loading jobs...</p>
      ) : jobsToDisplay.length === 0 ? (
        <p>No jobs found for this day.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Driver</th>
              <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Date</th>
              <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Type</th>
              <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Postcode</th>
              <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Price</th>
              <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Status</th>
              <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Notes</th>
              <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobsToDisplay.map((job) => (
              <tr key={job.id}>
                <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>{job.driver}</td>
                <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>{job.date}</td>
                <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>{job.type}</td>
                <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>{job.postcode}</td>
                <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>£{job.price}</td>
                <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>{job.status}</td>
                <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>{job.notes}</td>
                <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>
                  <button
                    onClick={() => openEditForm(job)}
                    style={{
                      marginRight: "0.5rem",
                      padding: "0.3rem 0.6rem",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    style={{
                      padding: "0.3rem 0.6rem",
                      borderRadius: "5px",
                      cursor: "pointer",
                      backgroundColor: "#f44336",
                      color: "white",
                      border: "none",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
