const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [
      "developer",
      "designer",
      "devOps",
      "tester",
      "teamLeader",
      "businessAnalyst",
      "marketer",
      "sales",
      "admin",
      "projectManager",
    ],
    default: "developer",
  },
  permissions: {
    type: [String],
    default: [],
  },
  githubUsername: { type: String, default: "" },
  githubToken: { type: String, default: "" },
  department: { type: String, default: "" },
});

module.exports = mongoose.model("User", userSchema);
