import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { parseResumeFile } from "../utils/resumeParser.js";

const router = express.Router();

// Configure multer to store uploaded files in a “uploads/” folder
const upload = multer({
  dest: path.resolve("uploads"),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
});

// POST /api/upload
// Expects multipart/form-data with “resumeFile” field
router.post("/", upload.single("resumeFile"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    //  Get the uploaded file’s path
    const uploadedFilePath = req.file.path;
    //  Extract plain text from that file
    const extractedText = await parseResumeFile(uploadedFilePath);
    //  Delete the temporary file
    await fs.unlink(uploadedFilePath);
    //  Return the extracted text
    res.json({ text: extractedText });
  } catch (err) {
    console.error("Error in /api/upload:", err);
    res.status(500).json({ error: "Failed to parse the uploaded file" });
  }
});

export default router;
