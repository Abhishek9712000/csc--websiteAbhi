const express = require("express");
const router = express.Router();
const Service = require("../models/Service");
const requireAdmin = require("../middleware/auth");

// GET /api/services - public list of active services
router.get("/", async (req, res) => {
  const services = await Service.find({ isActive: true }).sort({ category: 1, name: 1 });
  res.json(services);
});

// --- Admin-only management ---

// GET /api/services/admin/all (admin) - list every service including inactive ones
// NOTE: this must be defined before the "/:slug" route below, otherwise Express
// would treat "admin" as a slug value.
router.get("/admin/all", requireAdmin, async (req, res) => {
  const services = await Service.find().sort({ category: 1, name: 1 });
  res.json(services);
});

// GET /api/services/:slug - single service detail
router.get("/:slug", async (req, res) => {
  const service = await Service.findOne({ slug: req.params.slug, isActive: true });
  if (!service) return res.status(404).json({ error: "Service not found" });
  res.json(service);
});

// POST /api/services (admin) - add a new service
router.post("/", requireAdmin, async (req, res) => {
  try {
    const { name, category, description, price, requiredDocuments } = req.body;
    const slug = name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const service = await Service.create({
      name,
      slug,
      category,
      description,
      price,
      requiredDocuments: requiredDocuments || [],
    });
    res.status(201).json(service);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/services/:id (admin) - edit a service
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json(service);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/services/:id (admin) - deactivate a service (soft delete)
router.delete("/:id", requireAdmin, async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!service) return res.status(404).json({ error: "Service not found" });
  res.json({ success: true });
});

module.exports = router;
