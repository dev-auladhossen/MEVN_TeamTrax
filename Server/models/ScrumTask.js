const mongoose = require('mongoose');
const ScrumTaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, enum: ['backlog', 'todo', 'inprogress', 'review', 'done'], default: 'backlog' },
  priority: String,
  storyPoints: Number,
  sprintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sprint' },
  assigneedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('ScrumTask', ScrumTaskSchema);