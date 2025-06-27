const express = require("express");
const router = express.Router();
const getMongoQueryFromPrompt = require("../services/geminiService");
const Task = require("../models/Task");

// Utility to extract a MongoDB query from raw text response
function extractQuery(text) {
  if (!text) return null;

  // Try to extract from code block
  const codeBlockMatch = text.match(/```(?:js|javascript)?\n([\s\S]*?)```/);
  if (codeBlockMatch && codeBlockMatch[1]) {
    return codeBlockMatch[1].trim();
  }

  // Fallback: try inline db.query
  const inlineMatch = text.match(/db\..*?find\((.|\s)*?\)/);
  if (inlineMatch) {
    return inlineMatch[0].trim();
  }

  return null;
}

// Main analytics route
router.post("/analytics", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ success: false, error: "Prompt is required" });
  }

  try {
    const responseText = await getMongoQueryFromPrompt(prompt);

    const mongoQueryText = extractQuery(responseText);

    if (!mongoQueryText) {
      return res.status(400).json({
        success: false,
        error: "Failed to parse MongoDB query",
        raw: responseText,
      });
    }

    // Convert text query into real JS object safely
    let queryObj;
    try {
      // Try to isolate the object from find({ ... }) manually
      const jsonMatch = mongoQueryText.match(/find\s*\(\s*(\{[\s\S]*\})\s*\)/);
      if (!jsonMatch) throw new Error("No query object found in find()");

      queryObj = eval('(' + jsonMatch[1] + ')'); // 👈 Be cautious with eval!
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: "Mongo query object parsing failed",
        raw: mongoQueryText,
      });
    }

    const result = await Task.find(queryObj);
    return res.json({ success: true, data: result });
  } catch (err) {
    console.error("AI analytics error:", err);
    return res.status(500).json({
      success: false,
      error: "Gemini API or server error",
      raw: err.message,
    });
  }
});

module.exports = router;
