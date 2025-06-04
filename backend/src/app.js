import path from "path";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables from backend/.env (if present)
dotenv.config();

const app = express();

//  Serve static front-end files from the project-root “frontend” folder
const frontendPath = path.resolve("..", "frontend");
app.use(express.static(frontendPath));

//  Parse JSON bodies for /api/chat
app.use(express.json());

//  Enable CORS (allow all origins during development)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
  })
);

//  Mount “Upload Resume” route at /api/upload
import uploadRouter from "./routes/upload.js";
app.use("/api/upload", uploadRouter);

//  Mount “Rewrite Resume” route at /api/chat
import chatRouter from "./routes/chat.js";
app.use("/api/chat", chatRouter);

//  Fallback: return index.html for any other path
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

//  Start the server on the specified port (defaults to 3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`DeepScan API & frontend running at http://localhost:${PORT}`);
});
