const mongoose = require("mongoose");
const SprintSchema = new mongoose.Schema({
  name: String,
  startDate: Date,
  endDate: Date,
  goal: String,
  status: {
    type: String,
    enum: ["planned", "active", "completed"],
    default: "planned",
  },
});
module.exports = mongoose.model("Sprint", SprintSchema);
