const express = require("express");
const router = express.Router();
const Sprint = require("../models/Sprint");
const sprintRouter = express.Router();

// GET sprints with optional filtering by projectId and/or backlogId
sprintRouter.get("/sprints", async (req, res) => {
  try {
    const { projectId, backlogId } = req.query;
    const filter = {};
    if (projectId) filter.projectId = projectId;
    if (backlogId) filter.backlogId = backlogId;

    const sprints = await Sprint.find(filter);
    res.json(sprints);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sprints" });
  }
});

// POST create a new sprint
sprintRouter.post("/create-sprint", async (req, res) => {
  try {
    const { name, startDate, endDate, goal, status, projectId } = req.body;

    if (!projectId) {
      return res
        .status(400)
        .json({ error: "projectId and backlogId are required" });
    }

    const sprint = await Sprint.create({
      name,
      startDate,
      endDate,
      goal,
      status,
      projectId,
    });

    res.status(201).json(sprint);
  } catch (err) {
    res.status(500).json({ error: "Failed to create sprint" });
  }
});

// PATCH update sprint status
sprintRouter.patch("/sprints/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const updatedSprint = await Sprint.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedSprint) {
      return res.status(404).json({ error: "Sprint not found" });
    }

    res.json(updatedSprint);
  } catch (err) {
    console.error("Error updating sprint status:", err);
    res.status(500).json({ error: "Failed to update sprint status" });
  }
});

module.exports = sprintRouter;
