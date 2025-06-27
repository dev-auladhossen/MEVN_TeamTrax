const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getMongoQueryFromPrompt(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(`
Generate a valid MongoDB query using JavaScript syntax.
Use db.collection.find({...}) format.
Wrap the result inside triple backticks, like:
\`\`\`js
db.tasks.find({ "completedBy": "Developer" })
\`\`\`

Prompt: ${prompt}
    `);

    const response = result.response;
    return response.text();
  } catch (err) {
    console.error("Gemini API error:", err);
    throw err;
  }
}

module.exports = getMongoQueryFromPrompt;
