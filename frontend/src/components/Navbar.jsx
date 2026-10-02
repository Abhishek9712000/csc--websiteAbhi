import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
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
          padding: "15px 0",
        }}
      >
        {/* Left Side */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: "55px",
              height: "55px",
              borderRadius: "50%",
              background: "#0B3D91",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "22px",
              fontWeight: "bold",
            }}
          >
            M
          </div>

          <div>
            <h2
              style={{
                margin: 0,
                color: "#0B3D91",
                fontSize: "26px",
              }}
            >
              MAYANK DIGITAL STUDIO
            </h2>

            <p
              style={{
                margin: 0,
                color: "#666",
                fontSize: "14px",
              }}
            >
              Common Service Centre (CSC)
            </p>
          </div>
        </Link>

        {/* Right Side */}
        <nav
          style={{
            display: "flex",
            gap: "18px",
            alignItems: "center",
          }}
        >
          <NavItem to="/">Home</NavItem>
          <NavItem to="/services">Services</NavItem>
          <NavItem to="/track">Track</NavItem>
          <NavItem to="/admin">Owner Login</NavItem>
        </nav>
      </div>

      {/* Contact Bar */}
      <div
        style={{
          background: "#0B3D91",
          color: "white",
          textAlign: "center",
          padding: "8px",
          fontSize: "15px",
        }}
      >
        📍 Chandapur Market, Jayapur, Varanasi |
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