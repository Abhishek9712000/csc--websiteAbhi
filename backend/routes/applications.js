const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const { generateApplicationId } = require("../utils/generateId");
const { generateReceipt } = require("../utils/generateReceipt");
const Application = require("../models/Application");
const Service = require("../models/Service");
const upload = require("../middleware/upload");
const requireAdmin = require("../middleware/auth");

// ===============================
// CREATE APPLICATION
// ===============================
router.post("/", upload.array("documents", 10), async (req, res) => {
  try {
    console.log("\n========== NEW APPLICATION ==========");
    console.log("Request Body:");
    console.log(req.body);

    console.log("\nUploaded Files:");
    console.log(req.files);

    const {
      serviceId,
      customerName,
      customerPhone,
      customerEmail,
      notes,
    } = req.body;

    if (!serviceId || !customerName || !customerPhone) {
      return res.status(400).json({
        error: "Service, customer name and phone are required",
      });
    }

    console.log("\nSearching Service...");
    console.log("Service ID:", serviceId);

    const service = await Service.findById(serviceId);

    console.log("Service Found:");
    console.log(service);

    if (!service || !service.isActive) {
      return res.status(404).json({
        error: "Selected service is not available",
      });
    }

    const documents = (req.files || []).map((file) => ({
      originalName: file.originalname,
      storedName: file.filename,
      fileType: file.mimetype,
    }));

    let referenceId;
    let exists = true;

    while (exists) {
      referenceId = generateApplicationId();
      exists = await Application.findOne({ referenceId });
    }

    console.log("\nCreating Application...");

    const application = await Application.create({
      referenceId,
      service: service._id,
      serviceName: service.name,
      customerName,
      customerPhone,
      customerEmail,
      notes,
      documents,
      amount: service.price,
    });

    console.log("\nApplication Saved Successfully!");
    console.log(application);

    res.status(201).json({
      referenceId: application.referenceId,
      amount: application.amount,
      applicationId: application._id,
    });
  } catch (err) {
    console.log("\n========= ERROR =========");
    console.error(err);

    res.status(400).json({
      error: err.message,
    });
  }
});

// ===============================
// PAYMENT (Manual UTR - fallback)
// ===============================
router.post("/:id/payment", upload.single("screenshot"), async (req, res) => {
  try {
    const { utr } = req.body;

    if (!utr) {
      return res.status(400).json({
        error: "Please enter UTR Number",
      });
    }

    const update = {
      paymentUtr: utr,
      paymentStatus: "submitted",
    };

    if (req.file) {
      update.paymentScreenshot = {
        originalName: req.file.originalname,
        storedName: req.file.filename,
        fileType: req.file.mimetype,
      };
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    if (!application) {
      return res.status(404).json({
        error: "Application not found",
      });
    }

    res.json({
      success: true,
      referenceId: application.referenceId,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      error: err.message,
    });
  }
});

// ===============================
// TRACK APPLICATION
// ===============================
router.get("/track/:referenceId", async (req, res) => {
  try {
    const application = await Application.findOne({
      referenceId: req.params.referenceId,
    }).populate("service", "name");

    if (!application) {
      return res.status(404).json({
        error: "Application not found",
      });
    }

    res.json({
      referenceId: application.referenceId,
      serviceName: application.serviceName,
      status: application.status,
      paymentStatus: application.paymentStatus,
      amount: application.amount,
      createdAt: application.createdAt,
      adminNotes: application.adminNotes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// DOWNLOAD PDF RECEIPT (public)
// GET /api/applications/:id/receipt
// ===============================
router.get("/:id/receipt", async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Set headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="receipt-${application.referenceId}.pdf"`
    );

    // Generate PDF
    generateReceipt(res, application);
  } catch (err) {
    console.error("Receipt generation error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// ADMIN - GET ALL APPLICATIONS
// ===============================
router.get("/", requireAdmin, async (req, res) => {
  const { status, paymentStatus } = req.query;

  const filter = {};

  if (status) filter.status = status;
  if (paymentStatus) filter.paymentStatus = paymentStatus;

  const applications = await Application.find(filter).sort({
    createdAt: -1,
  });

  res.json(applications);
});

// ===============================
// ADMIN - GET SINGLE APPLICATION
// ===============================
router.get("/:id", requireAdmin, async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    return res.status(404).json({
      error: "Application not found",
    });
  }

  res.json(application);
});

// ===============================
// ADMIN - UPDATE APPLICATION
// ===============================
router.patch("/:id", requireAdmin, async (req, res) => {
  const allowed = [
    "status",
    "paymentStatus",
    "adminNotes",
  ];

  const update = {};

  for (const key of allowed) {
    if (key in req.body) {
      update[key] = req.body[key];
    }
  }

  const application = await Application.findByIdAndUpdate(
    req.params.id,
    update,
    { new: true }
  );

  if (!application) {
    return res.status(404).json({
      error: "Application not found",
    });
  }

  res.json(application);
});

// ===============================
// ADMIN - DOWNLOAD DOCUMENT
// ===============================
router.get("/:id/documents/:filename", requireAdmin, async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    return res.status(404).json({
      error: "Application not found",
    });
  }

  const validFiles = [
    ...application.documents.map((d) => d.storedName),
    application.paymentScreenshot?.storedName,
  ].filter(Boolean);

  if (!validFiles.includes(req.params.filename)) {
    return res.status(403).json({
      error: "Access denied",
    });
  }

  const filePath = path.join(
    __dirname,
    "..",
    "uploads",
    req.params.filename
  );

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      error: "File not found",
    });
  }

  res.sendFile(filePath);
});

module.exports = router;