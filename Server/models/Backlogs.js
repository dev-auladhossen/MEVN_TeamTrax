const mongoose = require("mongoose");
const BacklogsSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  title: String,
  description: String,
  status: {
    type: String,
    enum: ["backlog", "todo", "inprogress", "review", "done"],
    default: "backlog",
  },
  priority: String,
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Backlogs", BacklogsSchema);
