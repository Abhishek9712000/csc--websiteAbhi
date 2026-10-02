import { useState } from "react";
import qr from "../assets/images/qr-code.jpg";

export default function Pay() {
  const application = JSON.parse(
    localStorage.getItem("currentApplication")
  );

  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState(null);

  function handleSubmit() {
    if (!transactionId.trim()) {
      alert("Please enter your transaction ID.");
      return;
    }

    alert(
      `Payment submitted successfully!\n\nApplication Number: ${application?.applicationId}`
    );
  }

  return (
    <div
      className="container"
      style={{
        maxWidth: "650px",
        padding: "40px 20px",
        margin: "auto",
        textAlign: "center",
      }}
    >
      <h1>Complete Payment</h1>

      <div
        style={{
          background: "#fff",
          padding: "25px",
          borderRadius: "15px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
          marginTop: "20px",
        }}
      >
        <h2 style={{ color: "#0b3d91" }}>
          Application Number
        </h2>

        <p
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#ff6600",
          }}
        >
          {application?.applicationId || "MDS000000"}
        </p>

        <hr style={{ margin: "20px 0" }} />

        <p>
          <strong>Customer:</strong>{" "}
          {application?.customerName || "-"}
        </p>

        <p>
          <strong>Service:</strong>{" "}
          {application?.service || "-"}
        </p>

        <p>
          <strong>Amount:</strong>{" "}
          ₹{application?.amount || 0}
        </p>

        <img
          src={qr}
          alt="UPI QR Code"
          style={{
            width: "300px",
            maxWidth: "100%",
            margin: "30px 0",
            borderRadius: "15px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
          }}
        />

        <h3>Scan & Pay using any UPI app</h3>

        <p>
          PhonePe, Google Pay, Paytm, BHIM,
          Amazon Pay etc.
        </p>

        <p>
          <strong>UPI ID:</strong> ashishkumarsingh936@oksbi
        </p>

        <div
          style={{
            textAlign: "left",
            marginTop: "25px",
          }}
        >
          <label>
            Transaction ID
          </label>

          <input
            type="text"
            value={transactionId}
            onChange={(e) =>
              setTransactionId(e.target.value)
            }
            placeholder="Enter UPI Transaction ID"
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              marginBottom: "20px",
            }}
          />

          <label>
            Upload Payment Screenshot
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setScreenshot(e.target.files[0])
            }
            style={{
              width: "100%",
              marginTop: "8px",
              marginBottom: "20px",
            }}
          />

          {screenshot && (
            <p>
              Selected File: {screenshot.name}
            </p>
          )}
        </div>

        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "16px",
          }}
        >
          Submit Payment Details
        </button>
      </div>
    </div>
  );
}