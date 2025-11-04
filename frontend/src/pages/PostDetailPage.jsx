import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft, Heart, Trash2 } from "lucide-react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { formatDate } from "../lib/utils";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const PostDetailPage = () => {
  const { currentUser, token } = useAuth();
  console.log("currentUser:", currentUser);
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form fields for editing
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Fetch post details
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setPost(res.data);
        setTitle(res.data.title || "");
        setContent(res.data.content || "");
        setTags(res.data.tags?.join(", ") || "");
        setPreview(
          res.data.image
            ? res.data.image.startsWith("http")
              ? res.data.image
              : `http://localhost:5002${
                  res.data.image.startsWith("/")
                    ? res.data.image
                    : `/${res.data.image}`
                }`
            : null
        );
      } catch (err) {
        console.error("Error fetching post:", err);
        toast.error("Failed to load post details");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading)
    return <p className="text-center py-10 text-gray-600">Loading...</p>;
  if (!post)
    return <p className="text-center py-10 text-red-500">Post not found.</p>;

  // if (loading)
  //   return <p className="text-center py-10 text-gray-600">Loading...</p>;
  // if (!post)
  //   return <p className="text-center py-10 text-red-500">Post not found.</p>;

  // const isOwner = currentUser && post.author?._id === currentUser._id;
  // const isOwner =
  //   currentUser &&
  //   String(post.author?._id || "") ===
  //     String(currentUser._id || currentUser.id || "");

  const isOwner =
    currentUser &&
    String(post.author?._id || "") ===
      String(currentUser._id || currentUser.id || "");

  console.log("currentUser:", currentUser);
  console.log("post.author:", post.author);
  console.log("isOwner:", isOwner);

  if (loading)
    return <p className="text-center py-10 text-gray-600">Loading...</p>;
  if (!post)
    return <p className="text-center py-10 text-red-500">Post not found.</p>;

  // Like system
  const likesArray = Array.isArray(post.likedBy) ? post.likedBy : [];
  const isLiked = likesArray.includes(currentUser?._id);
  const likeCount = post.likes || likesArray.length || 0;

  // Handle like toggle (for others only)
  const handleLike = async () => {
    if (isOwner) return; // prevent liking own post
    try {
      const res = await api.put(`/posts/${post._id}/like`);
      setPost((prev) => ({
        ...prev,
        // likes: res.data.likes || [],
        // likeCount: res.data.likeCount,
        likes: res.data.likes,
        likedBy: res.data.likedBy,
      }));
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Failed to like post");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/posts/${post._id}`);
      toast.success("Post deleted successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle save (update)
  const handleSave = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      const tagsArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      formData.append("tags", JSON.stringify(tagsArray));
      if (image) formData.append("image", image);

      const res = await api.put(`/posts/${post._id}`, formData);
      setPost(res.data);
      toast.success("Post updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update post");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/40 to-white">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-20">
        {/* Back Button */}
        <Link
          to="/"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white border border-blue-100 rounded-2xl shadow-sm hover:shadow-md transition-all p-8">
          {/* Image */}
          {preview && (
            <img
              src={preview}
              alt={title}
              className="w-full h-72 object-cover rounded-xl mb-6 border border-blue-100"
            />
          )}

          {/* If owner → Editable fields */}
          {isOwner ? (
            <form onSubmit={handleSave} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows="6"
                  className="w-full bg-white border border-blue-200 rounded-lg px-4 py-3 resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full bg-white border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Update Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-700 border border-blue-200 rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Post
                </button>

                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg text-white font-medium transition-all duration-200"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Non-owner view */}
              <h1 className="text-3xl font-bold text-blue-700 mb-3">
                {post.title}
              </h1>
              <div className="flex gap-4 text-sm text-gray-500 mb-4">
                {post.author?.name && <p>✍️ {post.author.name}</p>}
                {post.createdAt && (
                  <p>🗓️ {formatDate(new Date(post.createdAt))}</p>
                )}
              </div>

              <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">
                {post.content}
              </p>

              {post.tags?.length > 0 && (
                <p className="text-sm text-blue-600 mb-6">
                  {post.tags.map((t, i) => (
                    <span key={i} className="mr-2">
                      #{t}
                    </span>
                  ))}
                </p>
              )}

              {/* Like Button */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 border rounded-full transition-all ${
                  isLiked
                    ? "bg-red-500 text-white border-red-500"
                    : "text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${isLiked ? "fill-white" : "fill-none"}`}
                  strokeWidth={1.8}
                />
                <span>{likeCount}</span>
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default PostDetailPage;
