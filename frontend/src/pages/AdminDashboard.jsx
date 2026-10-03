import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL, { api } from "../api";

// Status options with labels
const STATUS_OPTIONS = [
  { value: "received", label: "📥 Received" },
  { value: "in_progress", label: "⚙️ In Progress" },
  { value: "awaiting_documents", label: "📄 Awaiting Documents" },
  { value: "completed", label: "✅ Completed" },
  { value: "rejected", label: "❌ Rejected" },
];

const PAYMENT_OPTIONS = [
  { value: "pending", label: "⏳ Pending" },
  { value: "submitted", label: "📤 Submitted" },
  { value: "paid", label: "✅ Paid" },
  { value: "verified", label: "✅ Verified" },
  { value: "failed", label: "❌ Failed" },
];

export default function AdminDashboard({ token, onLogout }) {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState({});
  const [message, setMessage] = useState({});

  useEffect(() => {
    loadApplications();
    // eslint-disable-next-line
  }, [token]);

  function loadApplications() {
    setLoading(true);
    api
      .adminGetApplications(token)
      .then((data) => setApplications(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  // ============ UPDATE STATUS ============
  async function updateStatus(appId, newStatus) {
    setUpdating((prev) => ({ ...prev, [appId]: true }));
    try {
      const updated = await api.adminUpdateApplication(token, appId, {
        status: newStatus,
      });

      setApplications((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, ...updated } : a))
      );

      setMessage((prev) => ({
        ...prev,
        [appId]: `✅ Status updated to: ${newStatus.replace("_", " ")}`,
      }));
      setTimeout(() => {
        setMessage((prev) => ({ ...prev, [appId]: "" }));
      }, 3000);
    } catch (err) {
      setMessage((prev) => ({ ...prev, [appId]: `❌ ${err.message}` }));
    } finally {
      setUpdating((prev) => ({ ...prev, [appId]: false }));
    }
  }

  // ============ UPDATE PAYMENT STATUS ============
  async function updatePaymentStatus(appId, newStatus) {
    setUpdating((prev) => ({ ...prev, [appId]: true }));
    try {
      const updated = await api.adminUpdateApplication(token, appId, {
        paymentStatus: newStatus,
      });
      setApplications((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, ...updated } : a))
      );
      setMessage((prev) => ({
        ...prev,
        [appId]: `✅ Payment marked as: ${newStatus}`,
      }));
      setTimeout(() => {
        setMessage((prev) => ({ ...prev, [appId]: "" }));
      }, 3000);
    } catch (err) {
      setMessage((prev) => ({ ...prev, [appId]: `❌ ${err.message}` }));
    } finally {
      setUpdating((prev) => ({ ...prev, [appId]: false }));
    }
  }

  // ============ DOWNLOAD DOCUMENT ============
  const downloadDocument = async (appId, fileName, originalName) => {
    try {
      const response = await fetch(
        `${API_URL}/api/applications/${appId}/documents/${fileName}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = originalName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: "40px" }}>
        Loading applications...
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "40px 20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", margin: 0 }}>
          Admin Dashboard
        </h1>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/admin/change-password")}
            style={{
              padding: "10px 18px",
              border: "1.5px solid #0b3d91",
              background: "#fff",
              color: "#0b3d91",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            🔒 Change Password
          </button>

          <button className="btn btn-primary" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "12px",
          marginBottom: "30px",
        }}
      >
        <StatCard
          label="Total"
          value={applications.length}
          color="#0b3d91"
        />
        <StatCard
          label="Received"
          value={applications.filter((a) => a.status === "received").length}
          color="#d9822b"
        />
        <StatCard
          label="In Progress"
          value={applications.filter((a) => a.status === "in_progress").length}
          color="#d9822b"
        />
        <StatCard
          label="Completed"
          value={applications.filter((a) => a.status === "completed").length}
          color="#2f6d4f"
        />
      </div>

      {error && (
        <p style={{ color: "red", background: "#fee", padding: 12, borderRadius: 8 }}>
          {error}
        </p>
      )}

      {applications.length === 0 ? (
        <p>No applications submitted yet.</p>
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
          {applications.map((app) => (
            <div
              key={app._id}
              style={{
                background: "#fff",
                padding: "22px",
                borderRadius: "15px",
                boxShadow: "0 5px 15px rgba(0,0,0,.1)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <h2
                  style={{
                    color: "#0b3d91",
                    margin: 0,
                    fontFamily: "monospace",
                    fontSize: "1.3rem",
                  }}
                >
                  #{app.referenceId}
                </h2>

                <span
                  style={{
                    background: "#f0f4ff",
                    padding: "6px 12px",
                    borderRadius: 999,
                    fontSize: "0.8rem",
                    color: "#4b5875",
                  }}
                >
                  {new Date(app.createdAt).toLocaleString("en-IN")}
                </span>
              </div>

              {/* Details */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 10,
                  lineHeight: 1.8,
                  fontSize: "0.95rem",
                }}
              >
                <p style={{ margin: 0 }}>
                  <strong>Name:</strong> {app.customerName}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Phone:</strong> {app.customerPhone}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Email:</strong> {app.customerEmail || "N/A"}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Service:</strong> {app.serviceName || "N/A"}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Amount:</strong> ₹{app.amount}
                </p>
                {app.paymentUtr && (
                  <p style={{ margin: 0 }}>
                    <strong>UTR:</strong> {app.paymentUtr}
                  </p>
                )}
              </div>

              {app.notes && (
                <p style={{ marginTop: 12, fontSize: "0.9rem" }}>
                  <strong>Customer Notes:</strong> {app.notes}
                </p>
              )}

              {/* STATUS UPDATE SECTION */}
              <div
                style={{
                  marginTop: 20,
                  padding: 16,
                  background: "#f8f9fb",
                  borderRadius: 10,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 12,
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      marginBottom: 6,
                      color: "#4b5875",
                    }}
                  >
                    WORK STATUS
                  </label>
                  <select
                    value={app.status}
                    onChange={(e) => updateStatus(app._id, e.target.value)}
                    disabled={updating[app._id]}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1.5px solid #c9cdbd",
                      borderRadius: 6,
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      marginBottom: 6,
                      color: "#4b5875",
                    }}
                  >
                    PAYMENT STATUS
                  </label>
                  <select
                    value={app.paymentStatus}
                    onChange={(e) =>
                      updatePaymentStatus(app._id, e.target.value)
                    }
                    disabled={updating[app._id]}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1.5px solid #c9cdbd",
                      borderRadius: 6,
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    {PAYMENT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message */}
              {message[app._id] && (
                <p
                  style={{
                    marginTop: 10,
                    fontSize: "0.9rem",
                    color: message[app._id].startsWith("✅")
                      ? "#2f6d4f"
                      : "#a8382c",
                    fontWeight: 600,
                  }}
                >
                  {message[app._id]}
                </p>
              )}

              {/* Uploaded Documents */}
              {app.documents?.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <strong>📎 Uploaded Documents:</strong>
                  <div
                    style={{
                      marginTop: 10,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 10,
                    }}
                  >
                    {app.documents.map((doc, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          downloadDocument(
                            app._id,
                            doc.storedName,
                            doc.originalName
                          )
                        }
                        style={{
                          padding: "10px 14px",
                          border: "none",
                          borderRadius: 8,
                          background: "#0b3d91",
                          color: "white",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                        }}
                      >
                        📄 {doc.originalName}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Screenshot */}
              {app.paymentScreenshot?.storedName && (
                <div style={{ marginTop: 16 }}>
                  <button
                    onClick={() =>
                      downloadDocument(
                        app._id,
                        app.paymentScreenshot.storedName,
                        app.paymentScreenshot.originalName
                      )
                    }
                    style={{
                      padding: "10px 14px",
                      border: "none",
                      borderRadius: 8,
                      background: "#2f6d4f",
                      color: "white",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                    }}
                  >
                    📷 Download Payment Screenshot
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "16px",
        borderRadius: 10,
        boxShadow: "0 2px 8px rgba(0,0,0,.06)",
        borderLeft: `4px solid ${color}`,
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "0.8rem",
          color: "#4b5875",
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        {label}
      </p>
      <p
        style={{
          margin: "4px 0 0",
          fontSize: "1.8rem",
          fontWeight: 700,
          color,
        }}
      >
        {value}
      </p>
    </div>
  );
}