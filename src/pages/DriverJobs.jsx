import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "../index.css";

const driverList = Array.from({ length: 12 }, (_, i) => `Driver ${i + 1}`);
const today = new Date();

function DriverJobs() {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedDate, setSelectedDate] = useState(today);
  const [jobs, setJobs] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(today);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedDriver || !selectedDate) return;

    const fetchJobs = async () => {
      setLoading(true);
      const formattedDate = selectedDate.toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("driver_jobs")
        .select("*")
        .eq("driver", selectedDriver)
        .eq("date", formattedDate);

      if (error) {
        alert("Error loading jobs: " + error.message);
        setJobs([]);
      } else {
        setJobs(data || []);
      }
      setLoading(false);
    };

    fetchJobs();
  }, [selectedDriver, selectedDate]);

  const getDaysInMonth = (monthDate) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getStartDay = (monthDate) => {
    return new Date(monthDate.getFullYear(), monthDate.getMonth(), 1).getDay();
  };

  const isToday = (date) => {
    return date.toDateString() === new Date().toDateString();
  };

  const isSameDate = (a, b) => {
    return a.toDateString() === b.toDateString();
  };

  const handleDayClick = (day) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    setSelectedDate(newDate);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const startDay = getStartDay(currentMonth);
    const days = [];

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`}></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      days.push(
        <div
          key={day}
          onClick={() => handleDayClick(day)}
          style={{
            padding: "10px",
            textAlign: "center",
            borderRadius: "8px",
            backgroundColor: isSameDate(date, selectedDate)
              ? "#0071e3"
              : isToday(date)
              ? "#d0eaff"
              : "white",
            color: isSameDate(date, selectedDate) ? "white" : "black",
            cursor: "pointer",
            border: "1px solid #ccc",
          }}
        >
          {day}
        </div>
      );
    }

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "0.5rem",
          marginBottom: "2rem",
        }}
      >
        {days}
      </div>
    );
  };

  const goToPreviousMonth = () => {
    const prev = new Date(currentMonth);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentMonth(prev);
  };

  const goToNextMonth = () => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + 1);
    setCurrentMonth(next);
  };

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
      <h2>Driver Job List</h2>

      {!selectedDriver ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {driverList.map((driver) => (
            <button
              key={driver}
              onClick={() => setSelectedDriver(driver)}
              style={{
                padding: "0.75rem",
                borderRadius: "10px",
                border: "1px solid #5b8def",
                backgroundColor: "#e6f0ff",
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
          <div style={{ margin: "1rem 0" }}>
            <button
              onClick={() => setSelectedDriver(null)}
              style={{ marginRight: "1rem" }}
            >
              ⬅ Change Driver
            </button>
            <strong>{selectedDriver}</strong>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <button onClick={goToPreviousMonth}>←</button>
            <h3>
              {currentMonth.toLocaleString("default", { month: "long" })}{" "}
              {currentMonth.getFullYear()}
            </h3>
            <button onClick={goToNextMonth}>→</button>
          </div>

          {renderCalendar()}

          <h3 style={{ marginTop: "2rem" }}>
            Jobs for {selectedDate.toDateString()}
          </h3>

          {loading ? (
            <p>Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p>No jobs assigned for this day.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f0f0f0" }}>
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

export default DriverJobs;
