
import express from "express";
import multer from "multer";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

const router = express.Router();

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

/**
 * POST /api/upload
 * Field: resumeFile
 * Returns JSON { text: string }
 */
router.post("/", upload.single("resumeFile"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  const filePath = req.file.path;
  const ext = path.extname(req.file.originalname).toLowerCase().slice(1);

  try {
    let text = "";

    if (ext === "pdf") {
      const buffer = fs.readFileSync(filePath);
      const { text: pdfText } = await pdfParse(buffer);
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

export default router;
