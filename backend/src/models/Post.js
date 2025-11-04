import mongoose from "mongoose";

// Blog Post Schema
const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String }, // uploaded image path or URL
    tags: [{ type: String }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // store total like count (no user list)
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
