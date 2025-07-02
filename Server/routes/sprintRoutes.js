const express = require("express");
const router = express.Router();
const Sprint = require('../models/Sprint');
const sprintRouter = express.Router();

// GET sprints with optional filtering by projectId and/or backlogId
sprintRouter.get('/sprints', async (req, res) => {
  try {
    const { projectId, backlogId } = req.query;
    const filter = {};
    if (projectId) filter.projectId = projectId;
    if (backlogId) filter.backlogId = backlogId;

    const sprints = await Sprint.find(filter);
    res.json(sprints);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sprints' });
  }
});

// POST create a new sprint
sprintRouter.post('/create-sprint', async (req, res) => {
  try {
    const { name, startDate, endDate, goal, status, projectId, backlogId } = req.body;

    if (!projectId || !backlogId) {
      return res.status(400).json({ error: 'projectId and backlogId are required' });
    }

    const sprint = await Sprint.create({
      name,
      startDate,
      endDate,
      goal,
      status,
      projectId,
      backlogId,
    });

    res.status(201).json(sprint);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create sprint' });
  }
});

module.exports = sprintRouter;
