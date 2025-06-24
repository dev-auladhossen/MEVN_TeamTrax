// routes/project.js
const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const Task = require("../models/Task");
const TaskStatus = require("../models/TaskStatus");
const { getRepoDetails } = require("../services/github");
const { trackProjectProgress } = require('../utils/trackProjectProgress');
const ProjectProgress = require("../models/ProjectProgress");

// Create Project
router.post("/projects", async (req, res) => {
  try {
    const {
      name,
      description,
      startDate,
      endDate,
      duration,
      status,
      teams,
      createdBy,
    } = req.body;

    const newProject = new Project({
      name,
      description,
      startDate,
      endDate,
      duration,
      status,
      teams,
      createdBy,
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (err) {
    console.error("Create Project Error:", err);
    res.status(500).json({ message: "Failed to create project" });
  }
});

// Update Project
router.put("/projects/:id", async (req, res) => {
  try {
    const projectId = req.params.id;
    const { name, description, startDate, endDate, status, teams, createdBy } =
      req.body;

    const updatedData = {
      name,
      description,
      startDate,
      endDate,
      status,
      teams,
      createdBy,
    };

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      updatedData,
      {
        new: true, // returns updated document
        runValidators: true,
      }
    );
    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    await trackProjectProgress(projectId);
    res.json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (err) {
    console.error("Update Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET all projects with dynamic progress
router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "username");

    const projectsWithProgress = await Promise.all(
      projects.map(async (project) => {
        const tasks = await Task.find({ projectId: project._id });

        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(
          (task) => task.status === "Completed"
        ).length;

        const progress =
          totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return {
          ...project.toObject(),
          progress, // add dynamic progress field
        };
      })
    );

    res.json(projectsWithProgress);
  } catch (err) {
    console.error("Fetch Projects Error:", err.message);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
});

router.get("/project-details/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "createdBy", // field name
      "username email color title" // only include these fields
    );
    if (!project) {
      return res.status(400).json({ message: "Project not found!" });
    }

    // Fetch tasks related to this project
    const tasks = await Task.find({ projectId: project._id });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
      (task) => task.status === "Completed"
    ).length;

    const progress =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Convert to plain object so you can attach additional fields
    const projectWithProgress = {
      ...project.toObject(),
      progress,
    };
    res.json(projectWithProgress);
  } catch (err) {
    console.error("Error fetching project by ID:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

router.delete("/projects/:id", async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) {
      return res.status(400).json({ message: "Project not found!" });
    }
    res.json({ message: "Project Deleted Successfully!" });
  } catch (err) {
    console.error("Delete Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// Route to fetch repo info for a project
router.get("/github/:owner/:repo", async (req, res) => {
  const { owner, repo } = req.params;
  try {
    const data = await getRepoDetails(owner, repo);
    res.json(data);
  } catch (err) {
    console.error("GitHub error:", err.message);
    res.status(500).json({ message: "GitHub fetch failed" });
  }
});

// API for generate reports
router.get("/project-summary/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;

    // Step 1: Fetch project with createdBy populated
    const project = await Project.findById(projectId).populate("createdBy");
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Step 2: Fetch tasks that belong to the project
    const tasks = await Task.find({ projectId: projectId });

    // Step 3: Fetch all possible task statuses
    const taskStatuses = await TaskStatus.find({});

    // Step 4: Count tasks by each status dynamically
    const statusCounts = taskStatuses.reduce((acc, status) => {
      const count = tasks.filter((t) => t.status === status.name).length;
      acc[status.name] = count;
      return acc;
    }, {});

    // Step 5: Calculate total and completed/progress
    const total = tasks.length;
    const completed = statusCounts["Completed"] || 0;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const pending = total - completed - inProgress;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.json({
      projectId: project._id,
      projectName: project.name,
      description: project.description,
      manager: {
        name: project.createdBy?.username || "N/A",
        email: project.createdBy?.email || "N/A",
      },
      startDate: project.startDate,
      endDate: project.endDate,
      totalTasks: total,
      taskStatusBreakdown: statusCounts, // dynamic status data
      pendingTasks: pending,
      progress,
      status: project.status,
    });
  } catch (error) {
    console.error("Project Summary Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Route: /api/reports/project-progress/:projectId
router.get("/project-progress/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    console.log("projectId", projectId);

    // Fetch tasks with completedAt timestamp
    const tasks = await Task.find({ projectId });
    console.log("tasks", tasks);

    // Group progress by date
    const progressByDate = {};

    let completedCount = 0;

    // Sort by date
    const sortedTasks = tasks
      .filter((t) => t.status === "Completed" && t.completedAt)
      .sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));

    const totalTasks = tasks.length;

    sortedTasks.forEach((task) => {
      const date = new Date(task.completedAt).toISOString().split("T")[0]; // YYYY-MM-DD
      completedCount += 1;
      const progress = Math.round((completedCount / totalTasks) * 100);

      progressByDate[date] = progress;
    });

    res.json({
      labels: Object.keys(progressByDate),
      values: Object.values(progressByDate),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET /projects/:id/progress-history
router.get("/projects/:id/progress-history", async (req, res) => {
  const { id } = req.params;

  const history = await ProjectProgress.find({ projectId: id }).sort({
    date: 1,
  }); // ascending for chart

  res.json(history);
});

module.exports = router;
