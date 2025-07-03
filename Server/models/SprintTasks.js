const mongoose = require("mongoose");
const SprintTasksSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  title: { type: String, required: true },
  description: String,
  priority: { type: String, default: "Medium" },
  dueDate: Date,
  status: {
    type: String,
    enum: ["Backlog", "Todo", "InProgress", "Review", "Done"],
    default: "Backlog",
  },
  storyPoints: Number,
  sprintId: { type: mongoose.Schema.Types.ObjectId, ref: "Sprint" },
  assignedTo: { type: Array },
  attachments: { type: Array },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("SprintTasks", SprintTasksSchema);
