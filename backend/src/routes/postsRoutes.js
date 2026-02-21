import express from "express";
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

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
