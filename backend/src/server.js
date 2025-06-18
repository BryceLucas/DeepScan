import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Enable environment variables
dotenv.config();

// Initialize app
const app = express();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend files from /public or optionally ../frontend
const frontendPath = path.join(__dirname, "public"); // or use path.resolve("..", "frontend")
app.use(express.static(frontendPath));

// Enable JSON parsing for API routes
app.use(express.json());

// Enable CORS (helpful for frontend/backend dev separation)
app.use(cors({
  origin:  "*"
}));

// Mount /api/upload route
import uploadRoute from "./routes/upload.js";
app.use("/api/upload", uploadRoute);

// Mount /api/chat route
import chatRoute from "./routes/chat.js";
app.use("/api/chat", chatRoute);

// Fallback route (for client-side routing like React Router)
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`DeepScan server running at http://localhost:${PORT}`);
});
