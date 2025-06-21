import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar.jsx";

import Landing from "./pages/Landing.jsx";
import DriverJobs from "./pages/DriverJobs.jsx";
import Portaloo from "./pages/Portaloo.jsx";
import Quotes from "./pages/Quotes.jsx";
import Accounts from "./pages/Accounts.jsx";
import EmailBlast from "./pages/EmailBlast.jsx";
import Admin from "./pages/Admin.jsx";
import Jobs from "./pages/Jobs.jsx";
import Login from "./pages/Login.jsx"; // <-- new login page
import ProtectedRoute from "./components/ProtectedRoute.jsx"; // <-- protect all pages

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />

        {/* All other routes protected */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <>
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
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
