const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");

// Get unread messages count for current user (grouped by sender)
router.get("/unread/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const unreadMessages = await Chat.find({ receiverId: userId, read: false });

    const unreadCounts = await Chat.aggregate([
      { $match: { receiverId: userId, read: false } },
      {
        $group: {
          _id: "$senderId",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(unreadCounts);
  } catch (err) {
    console.error("Unread API error:", err);
    res.status(500).json({ error: "Failed to fetch unread counts" });
  }
});

// Get all chats between two users
router.get("/between/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;

  try {
    const messages = await Chat.find({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 },
      ],
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Mark messages as read between two users
router.put("/mark-read", async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    await Chat.updateMany(
      { senderId, receiverId, read: false },
      { $set: { read: true } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark messages as read" });
  }
});

module.exports = router;
