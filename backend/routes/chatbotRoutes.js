// routes/chatbotRoutes.js
const express = require("express");
const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "YOUR_GEMINI_API_KEY";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`;

router.post("/query", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "Question is required" });

    const geminiRes = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are AgriLink Assistant, an AI chatbot that answers farmers' questions **briefly** (2–3 sentences maximum). Avoid long lists, headings, or markdown.
Question: ${question}`,
              },
            ],
          },
        ],
      }),
    });

    const data = await geminiRes.json();
    console.log("🌾 Gemini 2.5 API Response:", data);

    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "⚠️ Sorry, I couldn’t get an answer right now.";

    // Force short replies (optional — truncate overly long text)
    const shortAnswer =
      answer.length > 350
        ? answer.slice(0, 350).split(".").slice(0, -1).join(".") + "."
        : answer;

    res.json({ answer: shortAnswer });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ error: "Server error contacting Gemini 2.5" });
  }
});

module.exports = router;
