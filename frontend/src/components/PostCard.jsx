import { PenLine, Trash2, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "../lib/utils";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { useState } from "react";

const PostCard = ({ post, setPosts, currentUser }) => {
  // Ensure likes array
  const likesArray = Array.isArray(post.likedBy)
    ? post.likedBy
    : Array.isArray(post.likes)
    ? post.likes
    : [];

  const [likeCount, setLikeCount] = useState(
    post.likes || likesArray.length || 0
  );
  const [isLiked, setIsLiked] = useState(
    likesArray.includes(currentUser?._id) || false
  );

  const isOwner =
    currentUser &&
    (post.author?._id === currentUser._id || post.author === currentUser._id);

  // Delete post
  const handleDelete = async (e, id) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await api.delete(`/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    }
  };

  // Like / Unlike post
  const handleLike = async (e) => {
    e.preventDefault();
    if (isOwner) return;

    try {
      const res = await api.put(`/posts/${post._id}/like`);
      const updatedLikes = res.data.likes || [];
      const updatedLikedBy = res.data.likedBy || [];

      setIsLiked(updatedLikedBy.includes(currentUser?._id));
      setLikeCount(updatedLikes.length || updatedLikedBy.length || 0);
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Failed to like post");
    }
  };

  // Compute image URL
  const imageUrl = post.image
    ? post.image.startsWith("http")
      ? post.image
      : `http://localhost:5002${
          post.image.startsWith("/") ? post.image : `/${post.image}`
        }`
    : null;

  return (
    <div className="group overflow-hidden rounded-2xl border border-blue-100 bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      {imageUrl && (
        <Link to={`/posts/${post._id}`} className="block overflow-hidden">
          <img
            src={imageUrl}
            alt={post.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <Link
          to={`/posts/${post._id}`}
          className="block hover:underline underline-offset-4"
        >
          <h3 className="text-2xl font-semibold text-blue-700 line-clamp-1 mb-3">
            {post.title}
          </h3>
        </Link>

        {/* Content preview */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
          {post.content?.trim()
            ? post.content
            : "No content available for this post."}
        </p>

        {/* Meta info */}
        <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-4">
          {post.author?.name && (
            <p>
              ✍️ <span className="font-medium">{post.author.name}</span>
            </p>
          )}
          {post.createdAt && <p>🗓️ {formatDate(new Date(post.createdAt))}</p>}
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <p className="text-sm text-blue-600 mb-4">
            {post.tags.map((t, i) => (
              <span key={i} className="mr-2">
                #{t}
              </span>
            ))}
          </p>
        )}

        {/* Footer: Like + Edit/Delete */}
        <div className="flex items-center justify-between border-t border-blue-100 pt-3">
          {/* Likes */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              disabled={isOwner}
              className={`flex items-center gap-1 text-sm transition-colors ${
                isOwner
                  ? "text-gray-400 cursor-not-allowed"
                  : isLiked
                  ? "text-red-500 hover:text-red-600"
                  : "text-gray-600 hover:text-red-500"
              }`}
              title={
                isOwner ? "You cannot like your own post" : "Like this post"
              }
            >
              <Heart
                className={`w-4 h-4 ${isLiked ? "fill-red-500" : ""}`}
                strokeWidth={1.8}
              />
              <span>{likeCount}</span>
            </button>
          </div>

          {/* Edit/Delete for Owner */}
          {isOwner && (
            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition">
              <Link
                to={`/posts/${post._id}`}
                className="text-blue-600 hover:text-blue-800 transition-colors"
                title="Edit"
              >
                <PenLine className="w-4 h-4" />
              </Link>
              <button
                onClick={(e) => handleDelete(e, post._id)}
                className="text-red-500 hover:text-red-700 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
