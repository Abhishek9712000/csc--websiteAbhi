import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function ChangePassword({ token, onLogout }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validations
    if (!form.currentPassword) {
      setError("Please enter your current password.");
      return;
    }

    if (form.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (form.currentPassword === form.newPassword) {
      setError("New password must be different from current password.");
      return;
    }

    setLoading(true);

    try {
      await api.adminChangePassword(
        token,
        form.currentPassword,
        form.newPassword
      );

      setSuccess("✅ Password changed successfully! Redirecting to login...");

      setTimeout(() => {
        onLogout();
        navigate("/admin");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="container"
      style={{
        maxWidth: 480,
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: 15,
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            color: "#0b3d91",
            marginBottom: 6,
            fontSize: "1.6rem",
          }}
        >
          🔒 Change Admin Password
        </h1>

        <p style={{ color: "#666", marginBottom: 24, fontSize: "0.9rem" }}>
          Update your admin password. You will need to login again after
          changing.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Current Password */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              Current Password *
            </label>
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              required
              autoComplete="current-password"
              style={{
                width: "100%",
                padding: 12,
                border: "1.5px solid #ddd",
                borderRadius: 6,
                fontSize: "1rem",
              }}
            />
          </div>

          {/* New Password */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              New Password *
            </label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              required
              minLength={6}
              autoComplete="new-password"
              style={{
                width: "100%",
                padding: 12,
                border: "1.5px solid #ddd",
                borderRadius: 6,
                fontSize: "1rem",
              }}
            />
            <p style={{ fontSize: "0.8rem", color: "#666", marginTop: 4 }}>
              Minimum 6 characters
            </p>
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              Confirm New Password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
              style={{
                width: "100%",
                padding: 12,
                border: "1.5px solid #ddd",
                borderRadius: 6,
                fontSize: "1rem",
              }}
            />
          </div>

          {error && (
            <div
              style={{
                background: "#fee",
                color: "#a8382c",
                padding: 12,
                borderRadius: 8,
                marginBottom: 20,
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
            >
              ❌ {error}
            </div>
          )}

          {success && (
            <div
              style={{
                background: "#e4efe7",
                color: "#2f6d4f",
                padding: 12,
                borderRadius: 8,
                marginBottom: 20,
                fontSize: "0.9rem",
                fontWeight: 600,
              }}
            >
              {success}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              width: "100%",
              padding: 14,
              fontSize: "1rem",
              marginBottom: 12,
            }}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            style={{
              width: "100%",
              padding: 12,
              fontSize: "0.95rem",
              background: "transparent",
              border: "1.5px solid #0b3d91",
              color: "#0b3d91",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Cancel
          </button>
        </form>

        <p
          style={{
            fontSize: "0.8rem",
            color: "#999",
            marginTop: 20,
            textAlign: "center",
          }}
        >
          After changing password, you'll be logged out automatically.
        </p>
      </div>
    </div>
  );
}