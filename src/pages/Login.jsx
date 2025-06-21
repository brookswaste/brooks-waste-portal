import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ADMIN_PASSWORD = "admin123"; // your admin password here

export default function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("adminLoggedIn", "true"); // session flag
      navigate("/"); // redirect to home or dashboard
    } else {
      setError("Incorrect password");
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "5rem auto", padding: "1rem", textAlign: "center" }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          autoFocus
        />
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
