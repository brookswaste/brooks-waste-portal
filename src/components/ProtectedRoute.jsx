import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const loggedIn = sessionStorage.getItem("adminLoggedIn") === "true";
  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
