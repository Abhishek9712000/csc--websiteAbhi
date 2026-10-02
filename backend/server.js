require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const servicesRoutes = require("./routes/services");
const applicationsRoutes = require("./routes/applications");
const adminRoutes = require("./routes/admin");
const paymentRoutes = require("./routes/payment.routes");

const app = express();

connectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
  })
);
app.use(express.json());

// Public config the frontend needs (UPI ID etc.) - no secrets here
app.get("/api/config", (req, res) => {
  res.json({
    upiId: process.env.UPI_ID || "",
    upiPayeeName: process.env.UPI_PAYEE_NAME || "",
  });
});

app.use("/api/services", servicesRoutes);
app.use("/api/applications", applicationsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Central error handler (e.g. multer file-type/size errors)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).json({ error: err.message || "Something went wrong" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`CSC backend running on port ${PORT}`));