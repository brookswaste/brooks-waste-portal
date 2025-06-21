import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const driverList = Array.from({ length: 12 }, (_, i) => `Driver ${i + 1}`);

function Jobs() {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch jobs when selectedDriver changes
  useEffect(() => {
    if (!selectedDriver) {
      setJobs([]);
      return;
    }

    const fetchJobs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("driver_jobs")
        .select("*")
        .eq("driver", selectedDriver)
        .order("date", { ascending: true });

      if (error) {
        alert("Error loading jobs: " + error.message);
        setJobs([]);
      } else {
        setJobs(data || []);
      }
      setLoading(false);
    };

    fetchJobs();
  }, [selectedDriver]);

  // Update status for a job
  const handleStatusChange = async (jobId, newStatus) => {
    const { error } = await supabase
      .from("driver_jobs")
      .update({ status: newStatus })
      .eq("id", jobId);

    if (error) {
      alert("Error updating status: " + error.message);
    } else {
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === jobId ? { ...job, status: newStatus } : job
        )
      );
    }
  };

  return (
    <div className="container" style={{ maxWidth: 900, margin: "2rem auto" }}>
      <h2>Jobs Dashboard</h2>

      {!selectedDriver ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {driverList.map((driver) => (
            <button
              key={driver}
              onClick={() => setSelectedDriver(driver)}
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "10px",
                border: "1px solid #0071e3",
                backgroundColor: "#d0eaff",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              {driver}
            </button>
          ))}
        </div>
      ) : (
        <>
          <button onClick={() => setSelectedDriver(null)} style={{ marginBottom: "1rem" }}>
            ← Back to Drivers
          </button>

          <h3>Jobs for {selectedDriver}</h3>

          {loading ? (
            <p>Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p>No jobs assigned to this driver.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f0f0f0" }}>
                  <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                    Date
                  </th>
                  <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                    Type
                  </th>
                  <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                    Postcode
                  </th>
                  <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                    Price
                  </th>
                  <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                    Status
                  </th>
                  <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                      {new Date(job.date).toLocaleDateString()}
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                      {job.type}
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                      {job.postcode}
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                      £{job.price}
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                      <select
                        value={job.status}
                        onChange={(e) =>
                          handleStatusChange(job.id, e.target.value)
                        }
                        style={{ padding: "0.25rem", borderRadius: "5px" }}
                      >
                        <option value="pending">Pending</option>
                        <option value="complete">Complete</option>
                        <option value="incomplete - issue">
                          Incomplete - Issue
                        </option>
                      </select>
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                      {job.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

export default Jobs;
