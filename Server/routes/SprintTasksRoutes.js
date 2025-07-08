const express = require("express");
const SprintTasks = require("../models/SprintTasks");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const User = require("../models/User");
const Project = require("../models/Project");
const fs = require("fs");
const checkPermission = require("../middleware/checkPermission");
const { trackProjectProgress } = require("../utils/trackProjectProgress");

const uploadsDir = "uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Store uploaded files in /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// GET all tasks
router.get("/get-allTasks", async (req, res) => {
  try {
    const tasks = await SprintTasks.find({})
      .populate("assignedTo")
      .populate("projectId", "_id name")
      .populate("sprintId");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// GET tasks (with optional filtering by projectId and sprintId)
router.get("/sprint-tasks", async (req, res) => {
  try {
    const { projectId, sprintId } = req.query;
    console.log("req.query", req.query);

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
    if (req.body.sprintId === "") {
      req.body.sprintId = null;
    }
    console.log("req.body", req.body);
    const task = await SprintTasks.create(req.body);
    console.log("task", task);
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

router.delete("/sprint-task/:id", async (req, res) => {
  try {
    const deletedTask = await SprintTasks.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(400).json({ message: "Task not found!" });
    }
    res.json({ message: "Task Deleted Successfully!" });
  } catch (err) {
    console.error("Delete Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/sprintTask-details/:id", async (req, res) => {
  try {
    const task = await SprintTasks.findById(req.params.id).populate(
      "projectId",
      "name"
    );
    if (!task) {
      return res.status(400).json({ message: "Task not found!" });
    }
    res.json(task);
  } catch (err) {
    console.error("Error fetching project by ID:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

router.put(
  "/sprint-task/:id",
  upload.array("attachments", 5),
  async (req, res) => {
    console.log("req.files", req.files);
    console.log("req.body", req.body);

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

    const uploadedAttachments = req.files?.map((file) => file.filename) || [];
    // Prepare update object
    const updateData = {
      title,
      description,
      status,
      priority,
      projectId,
      dueDate,
      assignedTo: JSON.parse(assignedTo),
    };

    // Only push attachments if any were uploaded
    if (uploadedAttachments.length > 0) {
      updateData.$push = {
        attachments: { $each: uploadedAttachments },
      };
    }

    try {
      const updatedTask = await SprintTasks.findByIdAndUpdate(
        taskId,
        updateData,
        {
          new: true,
        }
      );
      await trackProjectProgress(updatedTask.projectId);
      res.json(updatedTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Update failed" });
    }
  }
);

// Get tasks assigned to the logged-in developer
router.get("/dev/sprint-tasks", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const tasks = await SprintTasks.find({
      "assignedTo.id": userId,
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

module.exports = router;
