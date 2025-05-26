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
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
});

module.exports = router;
