import express from "express";
import axios from "axios";
// import dotenv from "dotenv";


const router = express.Router();

router.post("/", async (req, res) => {
  const { resumeText, field } = req.body;

  // 1) Basic validation
  if (!resumeText || resumeText.trim().length < 1) {
    return res.status(400).json({ error: "Missing resumeText" });
  }

  // 2) If no API key, return a placeholder message
  if (!process.env.DEEPSEEK_API_KEY) {
    const placeholder =
      `DeepSeek key not set yet. We received your resume for field "${field}".\n\n` +
      `Once the key is added, this endpoint will return a rewritten resume with rationales.`;
    return res.json({ message: placeholder });
  }

  // 3) Actual DeepSeek request
  console.log("Received resume rewrite request");

  const prompt = `Please improve this resume for a role in ${field}:\n${resumeText}`;

  try {
    const response = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const message = response.data.choices[0].message.content;
    res.json({ message });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "DeepSeek API error." });
  }
});

export default router;
