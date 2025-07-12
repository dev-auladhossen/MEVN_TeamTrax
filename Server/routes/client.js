const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authClientMiddleware = require("../middleware/clientAuth");
const Client = require("../models/Client");
const Project = require("../models/Project");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// Middleware to protect client routes
function clientAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.clientId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}

// Create client
router.post("/client/register", async (req, res) => {
  const { name, type, email, phone, password } = req.body;

  const existing = await Client.findOne({ email });
  if (existing)
    return res.status(400).json({ message: "Email already exists" });

  const client = new Client({ name, type, email, phone });
  await client.setPassword(password);
  await client.save();

  res.status(201).json({ message: "Client registered successfully" });
});

// Login client
router.post("/client/login", async (req, res) => {
  const { email, password } = req.body;
  const client = await Client.findOne({ email });
  if (!client || !(await client.validatePassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: client._id }, JWT_SECRET, { expiresIn: "1d" });
  res.json({ token });
});

// Link client to project
router.post("/client/:clientId/link/:projectId", async (req, res) => {
  const { clientId, projectId } = req.params;

  const client = await Client.findById(clientId);
  const project = await Project.findById(projectId);

  if (!client || !project)
    return res.status(404).json({ message: "Not found" });

  if (!client.linkedProjects.includes(projectId)) {
    client.linkedProjects.push(projectId);
    await client.save();
  }

  if (!project.clients.includes(clientId)) {
    project.clients.push(clientId);
    await project.save();
  }

  res.json({ message: "Client linked to project" });
});

// Get client’s projects
router.get("/client-linked/projects", clientAuth, async (req, res) => {
  const client = await Client.findById(req.clientId).populate("linkedProjects");
  if (!client) return res.status(404).json({ message: "Client not found" });

  res.json(client.linkedProjects);
});

// Submit feedback
router.post("/client/feedback/:projectId", clientAuth, async (req, res) => {
  const { projectId } = req.params;
  const { message } = req.body;

  const client = await Client.findById(req.clientId);
  if (!client) return res.status(404).json({ message: "Client not found" });

  client.feedback.push({ projectId, message });
  await client.save();

  res.json({ message: "Feedback submitted" });
});

// Change Password
router.put("/client/change-password", authClientMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const clientId = req.client.id;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Both current and new password are required" });
  }

  try {
    const client = await Client.findById(clientId);
    if (!client) return res.status(404).json({ message: "Client not found" });

    const isMatch = await client.comparePassword(currentPassword);
    if (!isMatch)
      return res.status(401).json({ message: "Current password is incorrect" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    client.password = hashedPassword;
    await client.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
