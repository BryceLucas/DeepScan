// File: backend/src/server.js

import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

// Init Express
const app = express();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve your built frontend from /public
const frontendPath = path.join(__dirname, "public");
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
