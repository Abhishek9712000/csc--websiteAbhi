import { useState } from "react";

export default function Track() {
  const [applicationId, setApplicationId] = useState("");
  const [application, setApplication] = useState(null);
  const [error, setError] = useState("");

  function handleTrack(e) {
    e.preventDefault();

    setError("");
    setApplication(null);

    const savedApplication = JSON.parse(
      localStorage.getItem("currentApplication")
    );

    if (!savedApplication) {
      setError("No application found.");
      return;
    }

    if (
      savedApplication.applicationId.toLowerCase() ===
      applicationId.trim().toLowerCase()
    ) {
      setApplication(savedApplication);
    } else {
      setError("Application not found.");
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
          placeholder="Enter Application Number"
          value={applicationId}
          onChange={(e) => setApplicationId(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
          required
        />

        <button
          type="submit"
          className="btn btn-primary"
          style={{
            width: "100%",
            padding: "14px",
          }}
        >
          Track Application
        </button>
      </form>

      {error && (
        <p
          style={{
            color: "red",
            marginTop: "20px",
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
          <h2 style={{ color: "#0b3d91" }}>
            Application Details
          </h2>

          <p>
            <strong>Application No:</strong>{" "}
            {application.applicationId}
          </p>

          <p>
            <strong>Name:</strong>{" "}
            {application.customerName}
          </p>

          <p>
            <strong>Phone:</strong>{" "}
            {application.customerPhone}
          </p>

          <p>
            <strong>Service:</strong>{" "}
            {application.service}
          </p>

          <p>
            <strong>Amount:</strong> ₹
            {application.amount}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            <span
              style={{
                color: "#ff9800",
                fontWeight: "bold",
              }}
            >
              Payment Verification Pending
            </span>
          </p>
        </div>
      )}
    </div>
  );
}