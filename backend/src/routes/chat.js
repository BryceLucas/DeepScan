import express from "express";
const router = express.Router();

// If we add the DeepSeek client later, we’d import it here.
// For now, we stub out a placeholder.
// import { getDeepSeekCompletion } from "../services/deepseekClient.js";

router.post("/", async (req, res) => {
  const { resumeText, field } = req.body;

  // 1) Basic validation: make sure resumeText is present
  if (!resumeText || resumeText.trim().length < 1) {
    return res.status(400).json({ error: "Missing resumeText" });
  }

  // 2) If no DeepSeek key has been set, return a dummy JSON message
  if (!process.env.DEEPSEEK_API_KEY) {
    const placeholder =
      `DeepSeek key not set yet. We received your résumé for field "${field}".\n\n` +
      `Once the key is added, this endpoint will return a rewritten résumé with rationales.`;
    return res.json({ message: placeholder });
  }

  // 3) Once we have a key, we’ll do something like this:
  /*
  try {
    // Build the system + user prompts
    const systemPrompt = `
      You are DeepScan’s résumé-rewriter.
      Rewrite the following résumé to be ATS-friendly for the field: ${field}.
      Provide a short rationale for each change.
    `;
    const userPrompt = `Résumé:\n${resumeText}`;

    // Call the DeepSeek service with streaming enabled
    const stream = await getDeepSeekCompletion({
      model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
      systemPrompt,
      userPrompt,
    });

    // Tell Express we’re going to send an SSE stream
    res.setHeader("Content-Type", "text/event-stream");
    for await (const chunk of stream) {
      const textPart = chunk.choices[0].delta.content || "";
      res.write(`data: ${textPart}\n\n`);
    }
    res.end();
  } catch (err) {
    console.error("Error calling DeepSeek:", err);
    res.status(500).json({ error: "DeepSeek request failed" });
  }
  */

  // 4) If we never un-comment the above block, this line will just be unreachable.
  //    So to satisfy ESLint or Node, we return here.
  return;
});

export default router;
