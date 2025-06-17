// routes/project.js
const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const Task = require("../models/Task");

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

module.exports = router;
