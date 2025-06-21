import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f7",
        padding: "4rem 2rem",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "2rem", color: "#1d1d1f" }}>
        Welcome to the Brooks Waste Portal
      </h1>
      <nav
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <Link to="/driver-jobs" style={linkStyle}>
          Driver Job List
        </Link>
        <Link to="/portaloo" style={linkStyle}>
          Portaloo Hire
        </Link>
        <Link to="/quotes" style={linkStyle}>
          Quotes
        </Link>
        <Link to="/accounts" style={linkStyle}>
          Accounts
        </Link>
        <Link to="/email-blast" style={linkStyle}>
          Email Blast
        </Link>
        <Link to="/admin" style={linkStyle}>
          Admin
        </Link>
      </nav>
    </div>
  );
}

const linkStyle = {
  backgroundColor: "#fff",
  padding: "1rem 2rem",
  borderRadius: "8px",
  textDecoration: "none",
  color: "#1d1d1f",
  fontWeight: "500",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  transition: "all 0.3s",
  display: "inline-block",
};

