// routes/project.js
const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// Create Project
router.post("/projects", async (req, res) => {
  try {
    const { name, description, startDate, endDate, status, teams, createdBy } =
      req.body;

    const newProject = new Project({
      name,
      description,
      startDate,
      endDate,
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

// (Optional) GET all projects route can be placed here too
router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "username");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
});

router.get("/project-details/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    console.log("project", project);
    if (!project) {
      return res.status(400).json({ message: "Project not found!" });
    }
    res.json(project);
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
