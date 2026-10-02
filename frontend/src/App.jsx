import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import TopMarquee from "./components/TopMarquee";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Apply from "./pages/Apply";
import Payment from "./pages/Payment";
import Track from "./pages/Track";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  const [token, setToken] = useState(
    () => localStorage.getItem("csc_admin_token") || ""
  );

  function handleLogin(tokenValue) {
    localStorage.setItem("csc_admin_token", tokenValue);
    setToken(tokenValue);
  }

  function handleLogout() {
    localStorage.removeItem("csc_admin_token");
    setToken("");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TopMarquee />
      <Navbar />

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/apply/:slug" element={<Apply />} />
          <Route path="/pay" element={<Payment />} />
          <Route path="/track" element={<Track />} />

          <Route
            path="/admin"
            element={
              token ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <AdminLogin onLogin={handleLogin} />
              )
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              token ? (
                <AdminDashboard
                  token={token}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/admin" replace />
              )
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <WhatsAppButton />
      <Footer />
    </div>
  );
}