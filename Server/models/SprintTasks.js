const mongoose = require("mongoose");
const SprintTasksSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  title: String,
  description: String,
  status: {
    type: String,
    enum: ["backlog", "todo", "inprogress", "review", "done"],
    default: "backlog",
  },
  priority: String,
  storyPoints: Number,
  sprintId: { type: mongoose.Schema.Types.ObjectId, ref: "Sprint" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("SprintTasks", SprintTasksSchema);
