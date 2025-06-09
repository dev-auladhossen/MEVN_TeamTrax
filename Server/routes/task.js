// routes/tasks.js
const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// Create task
router.post("/create-task", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all tasks (with project info)
router.get("/get-tasks", async (req, res) => {
  const tasks = await Task.find().populate("projectId", "name");
  res.json(tasks);
});

// GET tasks by projectId
router.get("/tasks/project/:projectId", async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
