import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import postsRoutes from "./routes/postsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

// Get __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5002;

// 🟢 Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json()); // parse JSON bodies
app.use(rateLimiter);

// 🖼️ Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// 🛠️ Routes
app.use("/api/posts", postsRoutes);
app.use("/api/auth", authRoutes);

// ⚙️ Production build (optional)
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
//   });
// }

// 🧩 Connect DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server started on PORT: ${PORT}`);
  });
});
