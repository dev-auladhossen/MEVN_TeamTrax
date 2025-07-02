const express = require("express");
const router = express.Router();
const TestUser = require("../models/testUsers");

// Save a test user
router.post("/test-save", async (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser = new TestUser({ name, email });
    await newUser.save();
    res.json({ message: "✅ User saved to MongoDB Atlas!", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all test users
router.get("/test-users", async (req, res) => {
  try {
    const users = await TestUser.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to fetch users" });
  }
});

module.exports = router;
