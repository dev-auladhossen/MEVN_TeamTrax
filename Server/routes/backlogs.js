const express = require("express");
const Backlogs = require("../models/Backlogs");
const BacklogsRouter = express.Router();

// GET backlog by projectId
BacklogsRouter.get("/backlogs/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const backlog = await Backlogs.findOne({ projectId }); // Assume one backlog per project
    if (!backlog) {
      return res
        .status(404)
        .json({ message: "Backlog not found for this project" });
    }
    res.json(backlog);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch backlog" });
  }
});

// POST create backlog
BacklogsRouter.post("/create-backlog", async (req, res) => {
  try {
    const { name, projectId } = req.body;
    if (!projectId || !name) {
      return res.status(400).json({ error: "projectId and name are required" });
    }

    // Optional: Check if backlog already exists for this project
    const existing = await Backlogs.findOne({ projectId });
    if (existing) {
      return res
        .status(400)
        .json({ error: "Backlog already exists for this project" });
    }

    const backlog = await Backlogs.create({ name, projectId });
    res.status(201).json(backlog);
  } catch (err) {
    res.status(500).json({ error: "Failed to create backlog" });
  }
});

module.exports = BacklogsRouter;
