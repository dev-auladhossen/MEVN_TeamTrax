const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Comment = require("../models/Comment");
const fs = require("fs");

const uploadsDir = "uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Store uploaded files in /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// POST /api/comments
router.post("/comments", upload.single("attachment"), async (req, res) => {
  try {
    const { taskId, userId, text } = req.body;
    const attachment = req.file ? req.file.filename : null;

    if (!taskId || !userId || !text) {
      return res
        .status(400)
        .json({ message: "taskId, userId and text are required." });
    }

    const newComment = new Comment({
      taskId,
      userId,
      text,
      mentions: [], // you can parse mentions from req.body if you want
      attachments: attachment ? [attachment] : [],
      reactions: [],
    });

    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (err) {
    console.error("Error posting comment:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// router.post("/comments", async (req, res) => {
//   try {
//     const { taskId, userId, text, mentions, attachments } = req.body;

//     if (!taskId || !userId || !text) {
//       return res
//         .status(400)
//         .json({ message: "taskId, userId and text are required." });
//     }

//     const newComment = new Comment({
//       taskId,
//       userId,
//       text,
//       mentions: mentions || [],
//       attachments: attachments || [],
//       reactions: [],
//     });

//     const savedComment = await newComment.save();
//     res.status(201).json(savedComment);
//   } catch (err) {
//     console.error("Error posting comment:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// GET /api/comments/:taskId
router.get("/comments/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;

    const comments = await Comment.find({ taskId })
      .populate("userId", "name") // get commenter name
      .populate("mentions", "name") // get mention names
      .sort({ createdAt: 1 }); // oldest first

    res.json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", upload.single("attachment"), async (req, res) => {
  try {
    const { taskId, userId, text } = req.body;
    const attachment = req.file ? req.file.filename : null;

    const comment = new Comment({
      taskId,
      userId,
      text,
      attachment,
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.use("/uploads", express.static("uploads")); // serve uploaded files

module.exports = router;
