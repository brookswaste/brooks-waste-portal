import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import "./App.css";

function App() {
  const [jobs, setJobs] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const todayDate = new Date();
  const formatDate = (date) => date.toISOString().split("T")[0];
  const todayStr = formatDate(todayDate);

  const yesterdayDate = new Date(todayDate);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = formatDate(yesterdayDate);

  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowStr = formatDate(tomorrowDate);

  const [selectedDate, setSelectedDate] = useState(todayStr);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    const { data, error } = await supabase.from("driver_jobs").select("*");
    if (error) {
      console.error(error);
    } else {
      setJobs(data);
    }
  }

  const drivers = [
    "Driver 1",
    "Driver 2",
    "Driver 3",
    "Driver 4",
    "Driver 5",
    "Driver 6",
    "Driver 7",
    "Driver 8",
    "Driver 9",
    "Driver 10",
    "Driver 11",
    "Driver 12",
  ];

  const filteredJobs = selectedDriver
    ? jobs.filter(
        (job) =>
          job.driver === selectedDriver &&
          job.date === selectedDate
      )
    : [];

  return (
    <main className="container" style={{ marginTop: "5rem" }}>
      <h1>Driver Job List</h1>

      {!selectedDriver ? (
        <>
          <h2>Select your name:</h2>
          <ul className="driver-list">
            {drivers.map((driver) => (
              <li key={driver}>
                <button onClick={() => setSelectedDriver(driver)}>
                  {driver}
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <button className="back-btn" onClick={() => setSelectedDriver(null)}>
            &larr; Back to driver list
          </button>

          <h2>Jobs for {selectedDriver}</h2>

          <div className="date-buttons">
            <button onClick={() => setSelectedDate(yesterdayStr)}>{yesterdayStr}</button>
            <button
              onClick={() => setSelectedDate(todayStr)}
              className="today-btn"
            >
              Today
            </button>
            <button onClick={() => setSelectedDate(tomorrowStr)}>{tomorrowStr}</button>
          </div>

          {filteredJobs.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Postcode</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job.id}>
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
          ) : (
            <p>No jobs found for this driver on this date.</p>
          )}
        </>
      )}
    </main>
  );
}

export default App;
function App() {
  return (
    <div className="site-container">
      {/* Your NavBar, Routes, etc. */}
    </div>
  );
}
