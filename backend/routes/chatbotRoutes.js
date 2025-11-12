const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ✅ Your key supports Gemini 2.5 Flash (June 2025 release)
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

router.post("/query", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Please provide a question" });
    }

    const response = await axios.post(GEMINI_URL, {
      contents: [
        {
          role: "user",
          parts: [{ text: question }],
        },
      ],
    });

    const aiText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ No AI response received.";

    res.status(200).json({
      question,
      answer: aiText,
    });
  } catch (error) {
    console.error("🔥 Gemini API Error:", error.response?.data || error.message);
    res.status(500).json({
      message: "Error getting AI response",
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;
