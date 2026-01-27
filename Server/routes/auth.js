require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/add-user", async (req, res) => {
  const { username, password, role, email, title, status, color } = req.body;

  try {
    // Only allow adding if username doesn't exist
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      role,
      email,
      title,
      status,
      color,
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  // console.log("JWT_SECRET from here", JWT_SECRET);
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      id: user._id,
      role: user.role,
      name: user.username,
      title: user.title,
      email: user.email,
      status: user.status,
      color: user.color,
      department: user.department,
      permissions: user.permissions,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update user
router.put("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email, title, role, status, color, password } = req.body;
    const updatedData = {
      username,
      email,
      title,
      role,
      status,
      color,
    };

    // Only update password if provided
    if (password) {
      updatedData.password = password;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true, // returns updated document
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Update Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user
router.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET GitHub settings
router.get("/user/github-settings", authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  const user = await User.findById(userId).select("githubUsername");
  res.json(user);
});

// POST GitHub settings
router.post("/user/github-settings", authMiddleware, async (req, res) => {
  try {
    const { githubUsername, githubToken } = req.body;
    const userId = req.user.userId;
    console.log(userId, githubUsername, githubToken);
    console.log("req.user", req.user);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { githubUsername, githubToken },
      { new: true }, // <-- returns the updated user
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "GitHub credentials saved successfully.",
      githubUsername: updatedUser.githubUsername,
    });
  } catch (err) {
    console.error("Error saving GitHub settings:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
