import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      style={{
        borderBottom: "1px solid #ddd",
        background: "#ffffff",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 0",
        }}
      >
        {/* Left Side - Logo */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            textDecoration: "none",
            flex: 1,
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              background: "#0B3D91",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "20px",
              fontWeight: "bold",
              flexShrink: 0,
            }}
          >
            M
          </div>

          <div style={{ minWidth: 0, overflow: "hidden" }}>
            <h2
              style={{
                margin: 0,
                color: "#0B3D91",
                fontSize: "clamp(14px, 3.5vw, 22px)",
                lineHeight: 1.1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              MAYANK DIGITAL STUDIO
            </h2>

            <p
              style={{
                margin: 0,
                color: "#666",
                fontSize: "clamp(10px, 2.5vw, 13px)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Common Service Centre (CSC)
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          style={{
            display: "flex",
            gap: "18px",
            alignItems: "center",
          }}
          className="desktop-nav"
        >
          <NavItem to="/">Home</NavItem>
          <NavItem to="/services">Services</NavItem>
          <NavItem to="/track">Track</NavItem>
          <NavItem to="/admin">Owner Login</NavItem>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="mobile-menu-btn"
          aria-label="Toggle menu"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            fontSize: "28px",
            color: "#0B3D91",
            display: "none",
          }}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div
          className="mobile-menu"
          style={{
            background: "#fff",
            borderTop: "1px solid #eee",
            padding: "10px 24px 20px",
            display: "none",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <MobileNavItem to="/" onClick={() => setMenuOpen(false)}>
            Home
          </MobileNavItem>
          <MobileNavItem to="/services" onClick={() => setMenuOpen(false)}>
            Services
          </MobileNavItem>
          <MobileNavItem to="/track" onClick={() => setMenuOpen(false)}>
            Track
          </MobileNavItem>
          <MobileNavItem to="/admin" onClick={() => setMenuOpen(false)}>
            Owner Login
          </MobileNavItem>
        </div>
      )}

      {/* Contact Bar */}
      <div
        style={{
          background: "#0B3D91",
          color: "white",
          textAlign: "center",
          padding: "8px 10px",
          fontSize: "clamp(11px, 2.8vw, 14px)",
          lineHeight: 1.4,
        }}
      >
        📍 Chandapur Market, Jayapur, Varanasi
        <span className="hide-mobile"> | </span>
        <br className="show-mobile" />
        📞 8574851039
      </div>
    </header>
  );
}

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        textDecoration: "none",
        color: isActive ? "#ff6b00" : "#333",
        fontWeight: "bold",
        fontSize: "16px",
      })}
    >
      {children}
    </NavLink>
  );
}

function MobileNavItem({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      style={({ isActive }) => ({
        textDecoration: "none",
        color: isActive ? "#ff6b00" : "#333",
        fontWeight: "bold",
        fontSize: "16px",
        padding: "12px 0",
        borderBottom: "1px solid #f0f0f0",
        display: "block",
      })}
    >
      {children}
    </NavLink>
  );
}