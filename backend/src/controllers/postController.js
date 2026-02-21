import Post from "../models/Post.js";
import User from "../models/User.js";

// 🟢 GET all posts (public feed)
export async function getAllPosts(req, res) {
  try {
    const { author, tag, sortBy, order } = req.query;

    const filter = {};

    // Filter by author name (case-insensitive)
    if (author) {
      const authorDoc = await User.findOne({
        name: { $regex: author, $options: "i" },
      });
      if (authorDoc) filter.author = authorDoc._id;
      else return res.status(200).json([]); // no posts if no author matches
    }

    // Filter by tag
    if (tag) filter.tags = { $in: [tag] };

    // Sorting logic
    let sort = {};
    if (sortBy === "likes") sort = { likes: order === "asc" ? 1 : -1 };
    else if (sortBy === "createdAt")
      sort = { createdAt: order === "asc" ? 1 : -1 };
    else sort = { createdAt: -1 }; // default: newest first

    const posts = await Post.find(filter)
      .populate("author", "name email")
      .sort(sort);

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// 🟢 GET single post by ID
export async function getPostById(req, res) {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "name email"
    );

    if (!post) return res.status(404).json({ message: "Post not found!" });
    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// 🟢 CREATE new post (with image upload)
export async function createPost(req, res) {
  try {
    const { title, content} = req.body;
    let { tags } = req.body;

    // ✅ Handle tags safely (JSON, comma string, or array)
    try {
      if (typeof tags === "string") {
        tags = JSON.parse(tags);
      }
    } catch {
      tags =
        typeof tags === "string" ? tags.split(",").map((t) => t.trim()) : [];
    }

    if (!Array.isArray(tags)) tags = [];

    // Clean tag formatting (remove #, empty)
    tags = tags.map((t) => t.trim().replace(/^#/, "")).filter(Boolean);

    // multer attaches file info to req.file
    const imagePath = req.file ? req.file.path : "";

    const newPost = new Post({
      title,
      content,
      image: imagePath,
      tags: Array.isArray(tags)
        ? tags
        : typeof tags === "string"
        ? tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [],
      author: req.user.id,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// 🟢 UPDATE post
export async function updatePost(req, res) {
  try {
    const { title, content, } = req.body;

    let { tags } = req.body;

    // ✅ Handle tags safely (JSON, comma string, or array)
    try {
      if (typeof tags === "string") {
        tags = JSON.parse(tags);
      }
    } catch {
      tags =
        typeof tags === "string" ? tags.split(",").map((t) => t.trim()) : [];
    }

    if (!Array.isArray(tags)) tags = [];

    // Clean tag formatting (remove #, empty)
    tags = tags.map((t) => t.trim().replace(/^#/, "")).filter(Boolean);

    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.author.toString() !== req.user.id)
      return res
        .status(403)
        .json({ message: "Not authorized to edit this post" });

    const updatedData = {
      title,
      content,
      tags: Array.isArray(tags)
        ? tags
        : typeof tags === "string"
        ? tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [],
    };

    if (req.file) updatedData.image = req.file.path;

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// 🟢 DELETE post
export async function deletePost(req, res) {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.author.toString() !== req.user.id)
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// 🟢 LIKE / UNLIKE post
export async function toggleLike(req, res) {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Prevent author from liking their own post
    if (post.author.toString() === userId)
      return res.status(400).json({ message: "You cannot like your own post" });

    // Initialize likedBy if missing (for backward compatibility)
    if (!post.likedBy) post.likedBy = [];

    // Toggle like/unlike
    const alreadyLiked = post.likedBy.includes(userId);

    if (alreadyLiked) {
      post.likedBy = post.likedBy.filter((id) => id.toString() !== userId);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      post.likedBy.push(userId);
      post.likes += 1;
    }

    await post.save();

    res.status(200).json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      likes: post.likes,
      likedBy: post.likedBy, // include array for frontend
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
