import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import postsRoutes from "./routes/postsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
app.set("trust proxy", 1);
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
