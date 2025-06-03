// backend/src/app.js

import path from "path";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables from backend/.env (if present)
dotenv.config();

const app = express();

// Correct the static path to point at the project‐root frontend folder
const frontendPath = path.resolve("..", "frontend");
app.use(express.static(frontendPath));

// Parse JSON bodies for our API
app.use(express.json());

// Enable CORS (allow all origins during development)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
  })
);

// Mount our resume‐chat route at /api/chat
import chatRouter from "./routes/chat.js";
app.use("/api/chat", chatRouter);

// Fallback: send index.html for any route not handled by /api
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Start listening on the port (defaults to 3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`DeepScan API & frontend running at http://localhost:${PORT}`);
});
