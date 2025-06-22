import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";            // Make sure this file defines .site-container
import NavBar from "./components/NavBar.jsx";

import Landing from "./pages/Landing.jsx";
import DriverJobs from "./pages/DriverJobs.jsx";
import Portaloo from "./pages/Portaloo.jsx";
import Quotes from "./pages/Quotes.jsx";
import Accounts from "./pages/Accounts.jsx";
import EmailBlast from "./pages/EmailBlast.jsx";
import Admin from "./pages/Admin.jsx";
import Jobs from "./pages/Jobs.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public login route */}
        <Route path="/login" element={<Login />} />

        {/* All other routes require login */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="site-container">
                <NavBar />
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/driver-jobs" element={<DriverJobs />} />
                  <Route path="/portaloo" element={<Portaloo />} />
                  <Route path="/quotes" element={<Quotes />} />
                  <Route path="/accounts" element={<Accounts />} />
                  <Route path="/email-blast" element={<EmailBlast />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/jobs" element={<Jobs />} />
                </Routes>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
