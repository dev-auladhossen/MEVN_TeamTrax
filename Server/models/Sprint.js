const mongoose = require('mongoose');

const SprintSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  backlogId: { type: mongoose.Schema.Types.ObjectId, ref: 'Backlog', required: true },
  name: String,
  startDate: Date,
  endDate: Date,
  goal: String,
  status: {
    type: String,
    enum: ['planned', 'active', 'completed'],
    default: 'planned'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sprint', SprintSchema);
