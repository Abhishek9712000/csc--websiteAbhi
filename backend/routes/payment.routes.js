const express = require("express");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const Application = require("../models/Application");

const router = express.Router();

// Initialize Razorpay
function getRazorpay() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// ===============================
// CREATE RAZORPAY ORDER
// POST /api/payment/create-order
// ===============================
router.post("/create-order", async (req, res) => {
  try {
    const { applicationId } = req.body;

    if (!applicationId) {
      return res.status(400).json({ error: "applicationId is required" });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    if (application.paymentStatus === "paid") {
      return res.status(400).json({ error: "Already paid" });
    }

    const razorpay = getRazorpay();

    const order = await razorpay.orders.create({
      amount: application.amount * 100, // amount in paise
      currency: "INR",
      receipt: application.referenceId,
      notes: {
        applicationId: application._id.toString(),
        referenceId: application.referenceId,
        serviceName: application.serviceName,
      },
    });

    // Save order id in application
    application.razorpayOrderId = order.id;
    await application.save();

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      referenceId: application.referenceId,
      customerName: application.customerName,
      customerEmail: application.customerEmail,
      customerPhone: application.customerPhone,
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// VERIFY PAYMENT
// POST /api/payment/verify
// ===============================
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      applicationId,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment details" });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      await Application.findByIdAndUpdate(applicationId, {
        paymentStatus: "failed",
      });
      return res.status(400).json({ error: "Payment verification failed" });
    }

    // Payment successful
    const application = await Application.findByIdAndUpdate(
      applicationId,
      {
        paymentStatus: "paid",
        paymentUtr: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json({
      success: true,
      referenceId: application.referenceId,
      applicationId: application._id,
    });
  } catch (err) {
    console.error("Verify payment error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;