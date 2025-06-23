const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  permissions: {
    type: [String],
    required: true,
  },
});

module.exports = mongoose.model("Permission", permissionSchema);
