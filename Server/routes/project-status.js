// routes/statusRoutes.js
const express = require("express");
const router = express.Router();
const Status = require("../models/ProjectStatus");

// Get all project statuses
router.get("/project/status", async (req, res) => {
  const statuses = await Status.find().sort({ order: 1 });
  res.json(statuses);
});

// Add a new project status
router.post("/project/status", async (req, res) => {
  try {
    const { name, color, order } = req.body;
    const newStatus = new Status({ name, color, order });
    const savedStatus = await newStatus.save();
    res.status(201).json(savedStatus);
  } catch (err) {
    console.error("Failed to create status:", err);
    res.status(500).json({ message: "Failed to create status" });
  }
});

// Update multiple project statuses (for drag order)
router.put("/project/status-reorder", async (req, res) => {
  const updates = req.body;
  const bulkOps = updates.map(({ _id, name, color, order }) => ({
    updateOne: {
      filter: { _id },
      update: { $set: { name, color, order } },
    },
  }));
  await Status.bulkWrite(bulkOps);
  res.json({ message: "Statuses reordered successfully" });
});

// Delete a single project status by ID
router.delete("/project/status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStatus = await Status.findByIdAndDelete(id);
    if (!deletedStatus) {
      return res.status(404).json({ error: "Status not found" });
    }
    res.json({ message: "Status deleted successfully" });
  } catch (err) {
    console.error("Failed to delete status:", err);
    res.status(500).json({ error: "Failed to delete status" });
  }
});

module.exports = router;
