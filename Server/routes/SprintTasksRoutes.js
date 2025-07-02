const express = require("express");
const SprintTasks = require("../models/SprintTasks");
const router = express.Router();

// GET tasks (with optional filtering by projectId and sprintId)
router.get("/sprint-tasks", async (req, res) => {
  try {
    const { projectId, sprintId } = req.query;

    if (!projectId) {
      return res.status(400).json({ error: "projectId is required" });
    }

    const query = { projectId };

    if (sprintId === "null") {
      query.sprintId = null;
    } else if (sprintId) {
      query.sprintId = sprintId;
    }

    const tasks = await SprintTasks.find(query).populate("assignedTo sprintId");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// POST create new task
router.post("/add-sprintTasks", async (req, res) => {
  try {
    const task = await SprintTasks.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to create task" });
  }
});

// PATCH update a task
router.patch("/sprint-task/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const updated = await SprintTasks.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

module.exports = router;
