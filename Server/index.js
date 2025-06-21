const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();

const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/project");
const projectStatusRoutes = require("./routes/project-status");
const taskStatusRoutes = require("./routes/task-status");
const taskRoutes = require("./routes/task");
const commentRoutes = require("./routes/comment");
const User = require("./models/User");
const githubRoutes = require("./routes/github");
const authMiddleware = require("./middleware/authMiddleware");

app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use("/api", commentRoutes);
app.use("/api", projectRoutes);
app.use("/api", taskRoutes);
app.use("/api", projectStatusRoutes);
app.use("/api", taskStatusRoutes);
app.use("/api", authRoutes);
app.use("/api/github", githubRoutes);
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://127.0.0.1:27017/project-tracker")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

// Basic route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/data", (req, res) => {
  const receivedData = req.body;
  res.send({ message: "Data received done with nodemon.", data: receivedData });
});

app.get("/home", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// API route to get users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
