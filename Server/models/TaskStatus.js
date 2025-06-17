const mongoose = require("mongoose");

const taskStatusSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  order: { type: Number, required: true },
});

module.exports = mongoose.model("TaskStatus", taskStatusSchema);
