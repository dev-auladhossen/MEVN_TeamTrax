const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReactionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  emoji: { type: String },
});

const CommentSchema = new Schema(
  {
    taskId: { type: Schema.Types.ObjectId, ref: "Task", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    mentions: [{ type: Schema.Types.ObjectId, ref: "User" }],
    attachments: [{ type: String }], // file URLs
    reactions: [ReactionSchema],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
