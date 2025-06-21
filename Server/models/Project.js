// models/Project.js
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    status: { type: String, default: "Planning" },
    startDate: Date,
    endDate: Date,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teams: [String],
    tasks: [Object],
    repoUrl: { type: String },
    githubRepo: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
