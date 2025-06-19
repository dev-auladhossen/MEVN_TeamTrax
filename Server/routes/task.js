// routes/tasks.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const upload = multer({ dest: "uploads/" });
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
  const tasks = await Task.find()
    .sort({ createdAt: -1 })
    .populate("projectId", "name");
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

router.get("/task-details/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "projectId",
      "name"
    );
    if (!task) {
      return res.status(400).json({ message: "Task not found!" });
    }
    res.json(task);
    console.log("from api", task);
  } catch (err) {
    console.error("Error fetching project by ID:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

router.delete("/task/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(400).json({ message: "Task not found!" });
    }
    res.json({ message: "Task Deleted Successfully!" });
  } catch (err) {
    console.error("Delete Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

router.put("/task/:id", upload.array("attachments", 5), async (req, res) => {
  const taskId = req.params.id;
  const {
    title,
    description,
    status,
    priority,
    projectId,
    dueDate,
    assignedTo,
  } = req.body;
  console.log("from api req.body", req.body);
  const attachments = req.files?.map((file) => file.filename) || [];

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        title,
        description,
        status,
        priority,
        projectId,
        dueDate,
        assignedTo: JSON.parse(assignedTo),
        $push: { attachments: { $each: attachments } },
      },
      { new: true }
    );
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update failed" });
  }
});

module.exports = router;
