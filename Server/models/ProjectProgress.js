const mongoose = require("mongoose");

const ProjectProgressSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  progress: { type: Number, required: true },
  totalTasks: Number,
  completedTasks: Number,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ProjectProgress", ProjectProgressSchema);
