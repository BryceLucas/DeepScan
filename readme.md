
# DeepScan

**DeepScan** is a web-based(coming soon), full‐stack resume‐enhancement tool that lets users upload or paste their résumé, extracts its plain text, and (in a later phase) sends that text to DeepSeek for an AI‐driven rewrite. This README summarizes how to install, configure, and run the project locally, as well as its folder layout and key dependencies.

---

## 🚀 Project Overview

- **Purpose**: Allow users to upload a PDF or DOCX resume (or paste it as text), extract clean, human‐readable text on the server, and prepare it for AI‐powered rewriting (via DeepSeek).  
- **Why extract first?** PDF and DOCX are binary or XML formats. AI models cannot parse those directly. By converting into UTF-8 text on the server, DeepSeek (or any LLM) receives only the words and sentences—no fonts, streams, or embedded images—ensuring valid input for rewriting.  
- **Current State**:  
  - Front end (“Coming Soon” page) with file-upload, text area, and “Rewrite Resume” button.  
  - Back end uses Express + Multer to accept uploads, `pdf-parse` (for .pdf) or `mammoth` (for .docx) to extract text, immediately deletes the temp file, and returns the text.  
  - A “looksLikeResumeText” check ensures that nonsensical or image-only PDFs trigger an alert.  
  - The `/api/chat` route is in place (with placeholder logic when no `DEEPSEEK_API_KEY` is provided).

---

## ✨ Key Features

- **Upload & Extract**  
  - Drag-and-drop or “Choose File” for PDF/DOCX.  
  - Server extracts text via `pdf-parse` (PDF) or `mammoth` (DOCX).  
  - Immediate client-side validation. If extracted text doesn’t resemble a real resume, an alert is shown.  
- **Paste & Rewrite**  
  - Users can paste raw resume text into a `<textarea>`.  
  - Click “Rewrite Resume” to send the text (and optional field-of-work) to `/api/chat`.  
- **AI Integration (coming soon)**  
  - Once you add your `DEEPSEEK_API_KEY` to `.env`, the back end will stream a rewritten resume from DeepSeek.  

---

## 🖥️ Prerequisites

- **Node.js** (v14 or later)  
- **npm** (v6 or later)  
- A modern browser (Chrome, Firefox, Edge, Safari)  

---

## 🔧 Installation & Setup

1. **Clone the repository**  
   ```bash
   git clone https://github.com/BryceLucas/DeepScan.git
   cd DeepScan