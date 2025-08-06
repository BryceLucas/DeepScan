import express from "express";
import multer from "multer";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

const router = express.Router();

// Quick health endpoint to verify proxy
router.get("/health", (_req, res) => {
  console.log("✅  [upload] /api/upload/health hit");
  return res.json({ ok: true, route: "/api/upload/health" });
});

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folder exists (sibling of src/)
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config: store in uploads/, max 10MB
const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/", upload.single("resumeFile"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  const filePath = req.file.path;
  const ext = path.extname(req.file.originalname).toLowerCase().slice(1);

  try {
    let text = "";

    if (ext === "pdf") {
      // ← Fixed: read file into buffer, then parse
      const dataBuffer = fs.readFileSync(filePath);
      const { text: pdfText } = await pdfParse(dataBuffer);
      text = pdfText;
    } else if (ext === "docx") {
      const { value } = await mammoth.extractRawText({ path: filePath });
      text = value;
    } else {
      return res.status(400).json({ error: "Unsupported file type." });
    }

    return res.json({ text });
  } catch (err) {
    console.error("Error extracting resume text:", err);
    return res.status(500).json({ error: "Failed to parse file." });
  } finally {
    // Clean up temp file
    try {
      await fsPromises.unlink(filePath);
    } catch (cleanupErr) {
      console.warn("Failed to delete temp file:", cleanupErr);
    }
  }
});

// Default export so `import uploadRoute from "./routes/upload.js"` works
export default router;
