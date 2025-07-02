const express = require("express");
const ScrumTask = require("../models/ScrumTask");
const router = express.Router();

router.get("/scrum-tasks", async (req, res) => {
  const tasks = await ScrumTask.find().populate("assigneedTo sprintId");
  res.json(tasks);
});
router.post("/add-scrumTask", async (req, res) => {
    console.log(req.body);
  const task = await ScrumTask.create(req.body);
  res.json(task);
});
router.patch("/scrum-task/:id", async (req, res) => {
  const task = await ScrumTask.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(task);
});

module.exports = router;
