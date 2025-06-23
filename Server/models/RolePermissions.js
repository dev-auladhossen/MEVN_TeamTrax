const mongoose = require("mongoose");

const RolePermissionSchema = new mongoose.Schema(
  {
    permissionsByRole: {
      type: Map,
      of: [String], // Each role maps to an array of permission strings
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("RolePermission", RolePermissionSchema);
