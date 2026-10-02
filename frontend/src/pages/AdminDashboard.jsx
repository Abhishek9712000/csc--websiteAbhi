import { useEffect, useState } from "react";
import { api } from "../api";

export default function AdminDashboard({ token, onLogout }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .adminGetApplications(token)
      .then((data) => {
        setApplications(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  const downloadDocument = async (
    appId,
    fileName,
    originalName
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/applications/${appId}/documents/${fileName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Download failed");
      }

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
    <div
      className="container"
      style={{
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1>Admin Dashboard</h1>

        <button
          className="btn btn-primary"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {applications.length === 0 ? (
        <p>No applications submitted yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "20px",
          }}
        >
          {applications.map((app) => (
            <div
              key={app._id}
              style={{
                background: "#fff",
                padding: "25px",
                borderRadius: "15px",
                boxShadow: "0 5px 15px rgba(0,0,0,.1)",
              }}
            >
              <h2 style={{ color: "#0b3d91" }}>
                {app.referenceId}
              </h2>

              <p>
                <strong>Name:</strong> {app.customerName}
              </p>

              <p>
                <strong>Phone:</strong> {app.customerPhone}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {app.customerEmail || "N/A"}
              </p>

              <p>
                <strong>Service:</strong>{" "}
                {app.serviceName || "N/A"}
              </p>

              <p>
                <strong>Amount:</strong> ₹{app.amount}
              </p>

              <p>
                <strong>Application Status:</strong>{" "}
                {app.status}
              </p>

              <p>
                <strong>Payment Status:</strong>{" "}
                {app.paymentStatus}
              </p>

              <p>
                <strong>Applied On:</strong>{" "}
                {new Date(
                  app.createdAt
                ).toLocaleString()}
              </p>

              {app.notes && (
                <p>
                  <strong>Notes:</strong> {app.notes}
                </p>
              )}

              {app.paymentUtr && (
                <p>
                  <strong>UTR Number:</strong>{" "}
                  {app.paymentUtr}
                </p>
              )}

              {/* Uploaded Documents */}
              {app.documents?.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                  <strong>Uploaded Documents:</strong>

                  <div
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
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
                          padding: "10px",
                          border: "none",
                          borderRadius: "8px",
                          background: "#0b3d91",
                          color: "white",
                          cursor: "pointer",
                          width: "fit-content",
                        }}
                      >
                        📄 Download {doc.originalName}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Screenshot */}
              {app.paymentScreenshot?.storedName && (
                <div style={{ marginTop: "20px" }}>
                  <strong>Payment Screenshot:</strong>

                  <div style={{ marginTop: "10px" }}>
                    <button
                      onClick={() =>
                        downloadDocument(
                          app._id,
                          app.paymentScreenshot.storedName,
                          app.paymentScreenshot.originalName
                        )
                      }
                      style={{
                        padding: "10px",
                        border: "none",
                        borderRadius: "8px",
                        background: "green",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      📷 Download Payment Screenshot
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}