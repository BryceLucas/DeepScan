// File: backend/src/server.js

import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables (backend/.env)
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

// Init Express
const app = express();

// Serve your frontend (adjust if your structure differs)
const frontendPath = path.join(__dirname, "..", "..", "frontend");
app.use(express.static(frontendPath));

// Middleware
app.use(express.json({ limit: "2mb" }));
app.use(cors({ origin: "*" }));

// Routes
import uploadRoute from "./routes/upload.js";
app.use("/api/upload", uploadRoute);

import chatRoute from "./routes/chat.js";
app.use("/api/chat", chatRoute);

// ✅ New: Resume Builder route
import buildRoute from "./routes/build.js";
app.use("/api/build", buildRoute);

// Fallback to index.html for client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`DeepScan server running on port ${PORT}`);
});