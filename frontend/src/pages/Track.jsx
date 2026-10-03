import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api";

export default function Track() {
  const [searchParams] = useSearchParams();
  const [applicationId, setApplicationId] = useState("");
  const [application, setApplication] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If URL has ?ref=XXXXX, auto-fill and search
  useEffect(() => {
    const refFromUrl = searchParams.get("ref");
    if (refFromUrl) {
      setApplicationId(refFromUrl);
      handleTrack(null, refFromUrl);
    }
    // eslint-disable-next-line
  }, []);

  async function handleTrack(e, refOverride) {
    if (e) e.preventDefault();

    const refId = (refOverride || applicationId).trim();

    if (!refId) {
      setError("Please enter an application number.");
      return;
    }

    setError("");
    setApplication(null);
    setLoading(true);

    try {
      const data = await api.trackApplication(refId);
      setApplication(data);
    } catch (err) {
      setError(err.message || "Application not found. Please check the number.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="container"
      style={{
        maxWidth: "700px",
        padding: "40px 20px",
      }}
    >
      <h1>Track Application</h1>

      <p style={{ color: "#666", marginBottom: "20px" }}>
        Enter your application number to check status.
      </p>

      <form onSubmit={handleTrack}>
        <input
          type="text"
          placeholder="Enter Application Number (e.g. 781374)"
          value={applicationId}
          onChange={(e) => setApplicationId(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "16px",
          }}
          required
        />

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
          }}
        >
          {loading ? "Searching..." : "Track Application"}
        </button>
      </form>

      {error && (
        <p
          style={{
            color: "red",
            marginTop: "20px",
            background: "#fee",
            padding: "12px",
            borderRadius: "8px",
          }}
        >
          {error}
        </p>
      )}

      {application && (
        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "15px",
            marginTop: "25px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ color: "#0b3d91", marginBottom: "20px" }}>
            Application Details
          </h2>

          <div style={{ lineHeight: 1.9 }}>
            <p>
              <strong>Application No:</strong>{" "}
              <span style={{ fontFamily: "monospace", color: "#a8382c" }}>
                {application.referenceId}
              </span>
            </p>

            <p>
              <strong>Service:</strong> {application.serviceName}
            </p>

            <p>
              <strong>Amount:</strong> ₹{application.amount}
            </p>

            <p>
              <strong>Applied On:</strong>{" "}
              {new Date(application.createdAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>

            <p>
              <strong>Payment Status:</strong>{" "}
              <span
                style={{
                  background:
                    application.paymentStatus === "paid"
                      ? "#e4efe7"
                      : "#fbeadb",
                  color:
                    application.paymentStatus === "paid"
                      ? "#2f6d4f"
                      : "#b5661a",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                {application.paymentStatus === "paid"
                  ? "✅ PAID"
                  : application.paymentStatus === "submitted"
                  ? "⏳ PENDING VERIFICATION"
                  : application.paymentStatus?.toUpperCase()}
              </span>
            </p>

            <p>
              <strong>Work Status:</strong>{" "}
              <span
                style={{
                  background:
                    application.status === "completed"
                      ? "#e4efe7"
                      : application.status === "in_progress"
                      ? "#fbeadb"
                      : "#eceee6",
                  color:
                    application.status === "completed"
                      ? "#2f6d4f"
                      : application.status === "in_progress"
                      ? "#b5661a"
                      : "#4b5875",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                {application.status === "received" && "📥 RECEIVED"}
                {application.status === "in_progress" && "⚙️ IN PROGRESS"}
                {application.status === "awaiting_documents" &&
                  "📄 AWAITING DOCUMENTS"}
                {application.status === "completed" && "✅ COMPLETED"}
                {application.status === "rejected" && "❌ REJECTED"}
                {!application.status && "RECEIVED"}
              </span>
            </p>

            {application.adminNotes && (
              <p>
                <strong>Admin Notes:</strong> {application.adminNotes}
              </p>
            )}
          </div>

          <div
            style={{
              marginTop: "20px",
              padding: "16px",
              background: "#f0f4ff",
              borderRadius: "8px",
              fontSize: "0.9rem",
              color: "#4b5875",
            }}
          >
            💡 <strong>Tip:</strong> Aap apna application status kabhi bhi
            check kar sakte hain. Application number sambhal kar rakhein.
          </div>
        </div>
      )}
    </div>
  );
}