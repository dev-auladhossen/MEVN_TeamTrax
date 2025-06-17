// routes/taskStatus.js
const express = require("express");
const router = express.Router();
const TaskStatus = require("../models/TaskStatus");

// Get all task statuses
router.get("/task/status", async (req, res) => {
  const statuses = await TaskStatus.find().sort({ order: 1 });
  res.json(statuses);
});

// Create a task status
router.post("/task/status", async (req, res) => {
  try {
    const status = new TaskStatus(req.body);
    await status.save();
    res.status(201).json(status);
  } catch (err) {
    res.status(500).json({ message: "Error creating task status" });
  }
});

// Update multiple task statuses (for drag order)
router.put("/task/status-reorder", async (req, res) => {
  const updates = req.body;
  const bulkOps = updates.map(({ _id, name, color, order }) => ({
    updateOne: {
      filter: { _id },
      update: { $set: { name, color, order } },
    },
  }));
  await TaskStatus.bulkWrite(bulkOps);
  res.json({ message: "Statuses reordered successfully" });
});

// Delete a single project status by ID
router.delete("/task/status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStatus = await TaskStatus.findByIdAndDelete(id);
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
