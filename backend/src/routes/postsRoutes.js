import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";


import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🖼️ Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads")); // folder where images are stored
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// 🟢 Public routes
router.get("/", getAllPosts);
router.get("/:id", getPostById);

// 🔒 Protected routes (requires auth)
router.post("/", protect, upload.single("image"), createPost);
router.put("/:id", protect, upload.single("image"), updatePost);
router.delete("/:id", protect, deletePost);

// ❤️ Like/Unlike route
router.put("/:id/like", protect, toggleLike);



export default router;
