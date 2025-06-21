// routes/tasks.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const Task = require("../models/Task");
const fs = require("fs");
const checkPermission = require("../middleware/checkPermission");

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
  } catch (err) {
    console.error("Error fetching project by ID:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

router.delete(
  "/task/:id",
  authMiddleware,
  authorize("admin"),
  async (req, res) => {
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
  }
);

router.put(
  "/task/:id",
  upload.array("attachments", 5),
  checkPermission("canEditTask"),
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
      const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, {
        new: true,
      });
      res.json(updatedTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Update failed" });
    }
  }
);

router.delete("/task/:taskId/attachment/:filename", async (req, res) => {
  const { taskId, filename } = req.params;

  try {
    // Remove filename from DB
    await Task.findByIdAndUpdate(taskId, {
      $pull: { attachments: filename },
    });

    // Remove file from disk
    const filePath = path.join(__dirname, "../uploads", filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ message: "Attachment deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete attachment" });
  }
});

// Get tasks assigned to the logged-in developer
router.get("/dev/tasks", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const tasks = await Task.find({
      "assignedTo.id": userId,
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

module.exports = router;
