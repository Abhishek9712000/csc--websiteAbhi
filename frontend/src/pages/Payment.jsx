import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Get application data from route state OR localStorage
    const stateApp = location.state;
    const storedApp = localStorage.getItem("currentApplication");

    let appData = null;

    if (stateApp && stateApp.applicationId) {
      appData = stateApp;
    } else if (storedApp) {
      try {
        appData = JSON.parse(storedApp);
      } catch (e) {
        console.error("Invalid stored application");
      }
    }

    if (!appData || !appData.applicationId) {
      setError("No application found. Please start again.");
      setLoading(false);
      return;
    }

    setApplication(appData);
    setLoading(false);

    // Load Razorpay script dynamically
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [location]);

  async function handlePayNow() {
    if (!application) return;

    setProcessing(true);
    setError("");

    try {
      // 1. Create order on backend
      const order = await api.createPaymentOrder(application.applicationId);

      // 2. Wait for Razorpay script to be ready
      if (!window.Razorpay) {
        throw new Error("Razorpay script not loaded. Please refresh the page.");
      }

      // 3. Open Razorpay checkout
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Mayank Digital Studio",
        description: `Payment for ${application.service}`,
        order_id: order.orderId,
        prefill: {
          name: application.customerName || "",
          contact: order.customerPhone || "",
          email: order.customerEmail || "",
        },
        theme: {
          color: "#0b3d91",
        },
        handler: async function (response) {
          // 4. Verify payment on backend
          try {
            const verifyResult = await api.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              applicationId: application.applicationId,
            });

            // 5. Update application with verified reference
            setApplication((prev) => ({
              ...prev,
              referenceId: verifyResult.referenceId,
              paymentId: response.razorpay_payment_id,
            }));

            // Clear current application
            localStorage.removeItem("currentApplication");

            setDone(true);
            setProcessing(false);
          } catch (err) {
            setError("Payment verification failed: " + err.message);
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
            setError("Payment cancelled. Please try again.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.message);
      setProcessing(false);
    }
  }

  // ===== SUCCESS SCREEN =====
  if (done) {
    const refId = application.referenceId;
    const appId = application.applicationId;

    return (
      <div className="container" style={{ padding: "48px 24px", maxWidth: 560 }}>
        <div className="token-slip">
          <div className="slip-label">Payment Successful ✅</div>
          <div className="slip-ref">{refId}</div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.9rem",
              color: "var(--ink-soft)",
              marginTop: 12,
            }}
          >
            Thank you! Your payment has been received. The shop owner will start
            work on your application. Save this reference number to track progress.
          </p>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 20,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/track?ref=${refId}`)}
            >
              Track Application
            </button>

            <button
              onClick={() => {
                window.open(api.getReceiptUrl(appId), "_blank");
              }}
              style={{
                background: "#fff",
                color: "#0b3d91",
                border: "2px solid #0b3d91",
                padding: "12px 24px",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "0.95rem",
              }}
            >
              📄 Download Receipt (PDF)
            </button>
          </div>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.85rem",
              color: "var(--ink-soft)",
              marginTop: 16,
            }}
          >
            💡 Tip: Receipt download karke save kar lo. Aage zaroorat padegi.
          </p>
        </div>
      </div>
    );
  }

  // ===== LOADING =====
  if (loading) {
    return (
      <div className="container" style={{ padding: 48 }}>
        Loading payment details...
      </div>
    );
  }

  // ===== ERROR (no application) =====
  if (!application) {
    return (
      <div className="container" style={{ padding: 48, maxWidth: 520 }}>
        <p style={{ color: "var(--bad)" }}>
          {error || "No application found."}
        </p>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/services")}
          style={{ marginTop: 16 }}
        >
          Browse Services
        </button>
      </div>
    );
  }

  // ===== MAIN PAYMENT SCREEN =====
  return (
    <div
      className="container"
      style={{ padding: "40px 24px 64px", maxWidth: 560 }}
    >
      <h1 className="display" style={{ fontSize: "1.6rem" }}>
        Complete Your Payment
      </h1>
      <p style={{ color: "var(--ink-soft)", marginTop: 6 }}>
        Reference: <span className="mono">{application.referenceId}</span>{" "}
        &middot; Amount:{" "}
        <strong className="mono">₹{application.amount}</strong>
      </p>

      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 12 }}>Order Summary</h3>
        <div style={{ lineHeight: 1.8, fontSize: "0.95rem" }}>
          <p>
            <strong>Service:</strong> {application.service}
          </p>
          <p>
            <strong>Name:</strong> {application.customerName}
          </p>
          {application.customerPhone && (
            <p>
              <strong>Phone:</strong> {application.customerPhone}
            </p>
          )}
        </div>

        <hr style={{ margin: "16px 0" }} />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          <span>Total:</span>
          <span>₹{application.amount}</span>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <button
          onClick={handlePayNow}
          disabled={processing}
          className="btn btn-primary"
          style={{ width: "100%", padding: 14, fontSize: 16 }}
        >
          {processing
            ? "Processing..."
            : `Pay ₹${application.amount} with Razorpay`}
        </button>

        <p
          style={{
            marginTop: 12,
            fontSize: "0.85rem",
            color: "var(--ink-soft)",
            textAlign: "center",
          }}
        >
          🔒 Secure payment via Razorpay — UPI, Card, Netbanking accepted
        </p>

        {error && (
          <p
            style={{
              color: "var(--bad)",
              marginTop: 12,
              fontSize: "0.9rem",
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}
      </div>

      <div
        className="card"
        style={{
          marginTop: 20,
          fontSize: "0.85rem",
          color: "var(--ink-soft)",
        }}
      >
        <strong>How it works:</strong>
        <ol style={{ marginTop: 8, paddingLeft: 20 }}>
          <li>Click "Pay with Razorpay"</li>
          <li>Choose UPI / Card / Netbanking</li>
          <li>Complete payment in the popup</li>
          <li>Download PDF receipt instantly</li>
          <li>Track your application anytime</li>
        </ol>
      </div>
    </div>
  );
}