const express = require("express");
const mongoose = require("mongoose");
const http = require("http"); // Needed to bind socket.io
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();
const Chat = require("./models/Chat");

const app = express();
const server = http.createServer(app);
const testUsersRoutes = require("./routes/testUsers");
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/project");
const projectStatusRoutes = require("./routes/project-status");
const taskStatusRoutes = require("./routes/task-status");
const taskRoutes = require("./routes/task");
const commentRoutes = require("./routes/comment");
const User = require("./models/User");
const githubRoutes = require("./routes/github");
const chatRoutes = require("./routes/chat");
const permissionRoutes = require("./routes/permission");
const analyticsRoutes = require("./routes/analytics");
const sprintRoutes = require("./routes/sprintRoutes");
const ScrumTaskRoutes = require("./routes/ScrumTaskRoutes");
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
app.use("/api", analyticsRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api", ScrumTaskRoutes);
app.use("/api", sprintRoutes);
app.use(express.urlencoded({ extended: true }));

// Setup Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Vue frontend dev server
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("send-message", async (data) => {
    const newMessage = new Chat({
      senderId: data.senderId,
      receiverId: data.receiverId,
      message: data.message,
    });
    const saved = await newMessage.save();

    io.emit("receive-message", saved);
    // Emit unread count update trigger
    io.emit("update-unread-count", {
      senderId: data.senderId,
      receiverId: data.receiverId,
    });
  });

  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

mongoose
  .connect(process.env.MONGO_URI)
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
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
