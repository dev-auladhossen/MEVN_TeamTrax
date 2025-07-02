const express = require("express");
const router = express.Router();
const Sprint = require('../models/Sprint');
const sprintRouter = express.Router();

sprintRouter.get('/sprints', async (req, res) => {
  const sprints = await Sprint.find();
  res.json(sprints);
});
sprintRouter.post('/create-sprint', async (req, res) => {
    console.log("req",req.body);
  const sprint = await Sprint.create(req.body);
  res.json(sprint);
});

module.exports = sprintRouter;