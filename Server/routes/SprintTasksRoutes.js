const express = require("express");
const SprintTasks = require("../models/SprintTasks");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const { io } = require("../index");
const Notification = require("../models/Notification");
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

    const task = await SprintTasks.create(req.body);

    // Notify assigned users
    const assignedUsers = req.body.assignedTo || [];

    // for (const user of assignedUsers) {
    //   const userId = user.id || user; // handles both object and string
    //    console.log("Iterating user:", user);

    //   const message = `You have been assigned to a new task: ${task.title}`;

    //   const notification = await Notification.create({
    //     userId: userId,
    //     message,
    //     relatedTaskId: task._id,
    //   });

    //   // Emit to the user room (userId must be a string)
    //   io.to(userId).emit("task-assigned-notification", notification);
    // }

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

    // Notify updated assignees
    const assignedUsers = req.body.assignedTo || [];

    for (const userId of assignedUsers) {
      const message = `You have been assigned/updated on task: ${updated.title}`;

      const notification = await Notification.create({
        userId,
        message,
        relatedTaskId: updated._id,
      });

      io.to(userId).emit("task-assigned-notification", notification);
    }
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

// GET /api/reports/overdue-tasks
router.get("/sprint-reports/overdue-tasks", async (req, res) => {
  try {
    const now = new Date();

    // Find overdue tasks
    const overdueTasks = await SprintTasks.find({
      dueDate: { $lt: now },
      status: { $ne: "done" },
    }).lean();

    // Unique project IDs
    const projectIds = [
      ...new Set(overdueTasks.map((task) => task.projectId?.toString())),
    ];

    // Fetch project titles
    const projects = await Project.find({ _id: { $in: projectIds } }).lean();
    const projectMap = {};
    projects.forEach((project) => {
      projectMap[project._id.toString()] = project.name;
    });

    // Prepare report objects
    const byProject = {};
    const byAssignee = {};

    overdueTasks.forEach((task) => {
      // Group by project
      const projectName =
        projectMap[task.projectId?.toString()] || "Unknown Project";
      byProject[projectName] = (byProject[projectName] || 0) + 1;

      // Group by each assigned user (embedded in task)
      if (task.assignedTo && task.assignedTo.length > 0) {
        task.assignedTo.forEach((user) => {
          const userName = user.username || user.fullName || "Unnamed";
          byAssignee[userName] = (byAssignee[userName] || 0) + 1;
        });
      } else {
        byAssignee["Unassigned"] = (byAssignee["Unassigned"] || 0) + 1;
      }
    });

    res.json({ byProject, byAssignee });
  } catch (err) {
    console.error("Overdue report error:", err);
    res.status(500).json({ error: "Failed to fetch overdue tasks report" });
  }
});

router.get("/sprint-member-performance", async (req, res) => {
  try {
    const { projectId, startDate, endDate } = req.query;

    const query = {};

    if (projectId) {
      query.projectId = projectId;
    }

    if (startDate || endDate) {
      query.updatedAt = {};
      if (startDate) query.updatedAt.$gte = new Date(startDate);
      if (endDate) query.updatedAt.$lte = new Date(endDate);
    }

    const now = new Date(); // consistent "now" reference

    const tasks = await SprintTasks.find(query).lean();
    console.log("tasks", tasks);

    const userStats = {};

    tasks.forEach((task) => {
      const assignedUsers = task?.assignedTo || [];
      const isCompleted = task.status === "done";
      const isOverdue = task.dueDate && new Date(task.dueDate) < now;

      assignedUsers?.forEach((user) => {
        const userId = typeof user === "object" ? user.id?.toString() : user;
        const username =
          typeof user === "object"
            ? user.username || user.fullName || "Unknown"
            : "Unknown";

        if (!userId) return;

        if (!userStats[userId]) {
          userStats[userId] = {
            name: username,
            total: 0,
            completed: 0,
            overdue: 0,
            completionDays: [],
          };
        }

        userStats[userId].total += 1;

        if (isCompleted) {
          userStats[userId].completed += 1;

          if (task.createdAt && task.updatedAt) {
            const days =
              (new Date(task.updatedAt) - new Date(task.createdAt)) /
              (1000 * 60 * 60 * 24);
            if (!isNaN(days) && days >= 0) {
              userStats[userId].completionDays.push(Number(days.toFixed(1)));
            }
          }
        }

        if (!isCompleted && isOverdue) {
          userStats[userId].overdue += 1;
        }
      });
    });

    // Final formatted result
    const performance = Object.values(userStats).map((stat) => {
      const onTime = stat.total - stat.overdue;
      const onTimeRate = stat.total > 0 ? (onTime / stat.total) * 100 : 0;
      const avgDays =
        stat.completionDays.length > 0
          ? (
              stat.completionDays.reduce((a, b) => a + b, 0) /
              stat.completionDays.length
            ).toFixed(1)
          : null;

      let performanceLabel = "Poor";
      if (onTimeRate >= 80) performanceLabel = "Good";
      else if (onTimeRate >= 50) performanceLabel = "Average";

      return {
        name: stat.name,
        totalTasks: stat.total,
        completed: stat.completed,
        overdue: stat.overdue,
        onTimeRate: Math.round(onTimeRate),
        avgCompletionDays: avgDays,
        performance: performanceLabel,
      };
    });

    // Sort by best performance first
    performance.sort((a, b) => b.onTimeRate - a.onTimeRate);

    res.json({ performance });
  } catch (err) {
    console.error("Member Performance Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
