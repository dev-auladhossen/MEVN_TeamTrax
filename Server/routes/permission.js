const express = require("express");
const router = express.Router();
const RolePermission = require("../models/RolePermissions");
const User = require("../models/User");

// Get role-permission map
router.get("/roles", async (req, res) => {
  try {
    const doc = await RolePermission.findOne();
    if (!doc) {
      return res.status(404).json({ error: "No permission data found." });
    }

    // Convert Map to plain JS object
    const plainObj = Object.fromEntries(doc.permissionsByRole);

    res.json(plainObj);
  } catch (err) {
    console.error("Error fetching permissions:", err);
    res.status(500).json({ error: "Server error fetching permissions." });
  }
});

// Save permissions by role and update users
router.post("/bulk-access-control", async (req, res) => {
  const rolePermissions = req.body;

  if (!rolePermissions || typeof rolePermissions !== "object") {
    return res.status(400).json({ error: "Invalid permissions payload." });
  }

  try {
    // 1️⃣ Save or update the single RolePermission document
    const existing = await RolePermission.findOne();
    if (existing) {
      existing.permissionsByRole = rolePermissions;
      await existing.save();
    } else {
      await RolePermission.create({ permissionsByRole: rolePermissions });
    }

    // 2️⃣ Assign permissions to users by role
    const roles = Object.keys(rolePermissions);

    for (const role of roles) {
      const permissions = rolePermissions[role];
      await User.updateMany(
        { role: role }, // match users with this role
        { $set: { permissions: permissions } }
      );
    }

    // 3️⃣ Give admin all-access (*) by default
    await User.updateMany({ role: "admin" }, { $set: { permissions: ["*"] } });

    res.status(200).json({ message: "Permissions updated successfully." });
  } catch (err) {
    console.error("Error updating permissions:", err);
    res.status(500).json({ error: "Server error updating permissions." });
  }
});

module.exports = router;
