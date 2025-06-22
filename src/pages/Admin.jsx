import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient"; // Adjust path if needed

const drivers = [
  "Driver 1", "Driver 2", "Driver 3", "Driver 4",
  "Driver 5", "Driver 6", "Driver 7", "Driver 8",
  "Driver 9", "Driver 10", "Driver 11", "Driver 12",
];

export default function Admin() {
  const today = new Date().toISOString().split("T")[0];
  const [jobs, setJobs] = useState([]);
  const [filterDay, setFilterDay] = useState(today);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [formData, setFormData] = useState({
    driver: "",
    date: today,
    type: "",
    postcode: "",
    price: "",
    status: "pending",
    notes: "",
  });
  const [bulkData, setBulkData] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [filterDay]);

  async function fetchJobs() {
    setLoading(true);
    const { data, error } = await supabase
      .from("driver_jobs")
      .select("*")
      .eq("date", filterDay);
    setJobs(data || []);
    setLoading(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { error } = await supabase.from("driver_jobs").insert([formData]);
    if (!error) {
      fetchJobs();
      setShowAddForm(false);
    } else {
      alert("Error: " + error.message);
    }
  }

  async function handleBulkSubmit(e) {
    e.preventDefault();
    const rows = bulkData.trim().split("\n");
    const jobEntries = rows.map((line) => {
      const [driver, date, type, postcode, price, status, notes] = line.split(",");
      return {
        driver: driver?.trim(),
        date: date?.trim(),
        type: type?.trim(),
        postcode: postcode?.trim(),
        price: price?.trim(),
        status: status?.trim() || "pending",
        notes: notes?.trim() || "",
      };
    });
    const { error } = await supabase.from("driver_jobs").insert(jobEntries);
    if (!error) {
      fetchJobs();
      setShowBulkForm(false);
    } else {
      alert("Error: " + error.message);
    }
  }

  return (
    <div style={{ maxWidth: 1000, margin: "2rem auto", padding: "1rem" }}>
      <h1>Admin Dashboard</h1>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Select Date:{" "}
          <input
            type="date"
            value={filterDay}
            onChange={(e) => setFilterDay(e.target.value)}
          />
        </label>
        <button onClick={() => setShowAddForm(true)} style={{ marginLeft: "1rem" }}>
          Add Job
        </button>
        <button onClick={() => setShowBulkForm(true)} style={{ marginLeft: "1rem" }}>
          Bulk Add Jobs
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
          <h2>Add Job</h2>
          <select name="driver" onChange={handleChange} required>
            <option value="">Select Driver</option>
            {drivers.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          <input type="text" name="type" placeholder="Type" onChange={handleChange} required />
          <input type="text" name="postcode" placeholder="Postcode" onChange={handleChange} />
          <input type="number" name="price" placeholder="Price" onChange={handleChange} />
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="complete">Complete</option>
            <option value="incomplete - issue">Incomplete - Issue</option>
          </select>
          <textarea name="notes" placeholder="Notes" onChange={handleChange} />
          <button type="submit">Submit</button>
        </form>
      )}

      {showBulkForm && (
        <form onSubmit={handleBulkSubmit} style={{ marginBottom: "2rem" }}>
          <h2>Bulk Add Jobs</h2>
          <p>Format: Driver, Date (YYYY-MM-DD), Type, Postcode, Price, Status, Notes</p>
          <textarea
            rows={10}
            cols={100}
            value={bulkData}
            onChange={(e) => setBulkData(e.target.value)}
            required
          />
          <br />
          <button type="submit">Submit Bulk Jobs</button>
        </form>
      )}

      <h2>Jobs for {filterDay}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Driver</th><th>Date</th><th>Type</th><th>Postcode</th><th>Price</th><th>Status</th><th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.driver}</td>
                <td>{job.date}</td>
                <td>{job.type}</td>
                <td>{job.postcode}</td>
                <td>£{job.price}</td>
                <td>{job.status}</td>
                <td>{job.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
