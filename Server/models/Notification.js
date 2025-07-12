const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["task-assigned", "comment", "general"],
      default: "task-assigned",
    },
    message: { type: String },
    isRead: { type: Boolean, default: false },
    relatedTaskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SprintTasks",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
