import { Link, useLocation, useNavigate } from "react-router-dom";

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Driver Job List", path: "/driver-jobs" },
    { name: "Portaloo Hire", path: "/portaloo" },
    { name: "Quotes", path: "/quotes" },
    { name: "Accounts", path: "/accounts" },
    { name: "Email Blast", path: "/email-blast" },
    { name: "Admin", path: "/admin" },
  ];

  function handleLogout() {
    sessionStorage.removeItem("adminLoggedIn");
    navigate("/login");
  }

  return (
    <nav
      style={{
        padding: "1rem 2rem",
        backgroundColor: "#f0f4ff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}
    >
      {/* Logo centered at top */}
      <div style={{ marginBottom: "1rem" }}>
        <Link to="/">
          <img
            src="/brooks-logo.png"
            alt="Brooks Waste Logo"
            style={{ height: 50 }}
          />
        </Link>
      </div>

      {/* Navigation links centered */}
      <div
        style={{
          display: "inline-flex",
          gap: "1rem",
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: "1rem",
        }}
      >
        {navLinks.map(({ name, path }) => (
          <Link
            key={path}
            to={path}
            className={location.pathname === path ? "active" : ""}
            style={{
              textDecoration: "none",
              color: location.pathname === path ? "#3498db" : "#333",
              fontWeight: location.pathname === path ? "bold" : "normal",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              backgroundColor: location.pathname === path ? "#dceeff" : "transparent",
              transition: "background-color 0.3s",
            }}
          >
            {name}
          </Link>
        ))}
      </div>

      {/* Logout button centered below nav */}
      <div>
        <button
          onClick={handleLogout}
          style={{
            padding: "0.5rem 1.5rem",
            cursor: "pointer",
            backgroundColor: "#e74c3c",
            border: "none",
            borderRadius: "4px",
            color: "white",
            fontWeight: "bold",
          }}
          title="Logout"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
