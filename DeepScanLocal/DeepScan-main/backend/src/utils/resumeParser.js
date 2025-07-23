// Prevents pdf-parse from running its internal test harness causing issues with npm run dev
process.env.AUTO_KENT_DEBUG = "false";

import fs from "fs/promises";
import pdf from "pdf-parse";
import mammoth from "mammoth";
import path from "path";

export async function parseResumeFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".pdf") {
    const dataBuffer = await fs.readFile(filePath);
    const pdfData = await pdf(dataBuffer);
    return pdfData.text;
  } else if (ext === ".docx") {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } else {
    return await fs.readFile(filePath, "utf-8");
  }
}
