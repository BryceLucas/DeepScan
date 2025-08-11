// backend/src/routes/build.js
import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const d = req.body || {};
    if (!d || (!d.name && !d.experiences?.length && !d.skills?.length)) {
      return res.status(400).json({ error: "No resume content provided." });
    }
//this tells Deepseek parameters to use when asking it to build it for you
    const prompt = `
You are an ATS-focused resume assistant. Improve the following resume data.
Return JSON with fields: summary (string), skills (string[]), experiences (array of {title, company, start, end, bullets: string[]}).
Write concise, results-focused bullets. Keep facts plausible; don't invent employers or dates.

DATA:
${JSON.stringify(d, null, 2)}
`;

    const resp = await fetch(
      process.env.DEEPSEEK_API_URL || "https://api.deepseek.com/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
          messages: [
            { role: "system", content: "You write concise, ATS-optimized resumes." },
            { role: "user", content: prompt },
          ],
          temperature: 0.4,
        }),
      }
    );

    if (!resp.ok) {
      const txt = await resp.text().catch(() => "");
      return res.status(502).json({ error: "DeepSeek error", detail: txt || resp.statusText });
    }

    const payload = await resp.json();
    const text = payload?.choices?.[0]?.message?.content ?? "";
    let out;
    try { out = JSON.parse(text); } catch { out = { summary: text }; }

    res.json({
      summary: out.summary || "",
      skills: Array.isArray(out.skills) ? out.skills : undefined,
      experiences: Array.isArray(out.experiences) ? out.experiences : undefined,
    });
  } catch (e) {
    console.error("/api/build error:", e);
    res.status(500).json({ error: "Server error in /api/build" });
  }
});

export default router;
