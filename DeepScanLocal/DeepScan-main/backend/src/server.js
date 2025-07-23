// File: backend/src/server.js

import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });
console.log("✅ Loaded DEEPSEEK_API_KEY:", process.env.DEEPSEEK_API_KEY);

// Init Express
const app = express();

// Serve your built frontend from /public
const frontendPath = path.join(__dirname, "..", "..", "frontend");
app.use(express.static(frontendPath));

// JSON parsing for API
app.use(express.json());

// CORS (allow all origins for now)
app.use(cors({ origin: "*" }));

// Mount your upload & chat routers
import uploadRoute from "./routes/upload.js";
app.use("/api/upload", uploadRoute);

import chatRoute from "./routes/chat.js";
app.use("/api/chat", chatRoute);

// Fallback to index.html for client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Start listening
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`DeepScan server running on port ${PORT}`);
});
