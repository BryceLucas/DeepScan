import express from "express";
import multer from "multer";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

const router = express.Router();

// Set up Multer to save uploads in "uploads/" folder
const upload = multer({
  dest: path.resolve("uploads"),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// POST /api/upload
router.post("/", upload.single("resumeFile"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = req.file.path;
  const ext = path.extname(req.file.originalname).toLowerCase().slice(1);

  try {
    let text = "";

    if (ext === "pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      text = pdfData.text;
    } else if (ext === "docx") {
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;
    } else {
      return res.status(400).json({ error: "Unsupported file type." });
    }

    // Clean up temp file
    await fsPromises.unlink(filePath);

    return res.json({ text });
  } catch (err) {
    console.error("Error extracting resume text:", err);
    return res.status(500).json({ error: "Error extracting text from file." });
  }
});