import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import api from "../lib/axios";
import Navbar from "../components/Navbar";

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Handle image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      // ✅ Proper tag serialization for multer + backend
      formData.append(
        "tags",
        tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      );

      if (image) formData.append("image", image);

      await api.post("/posts", formData);

      toast.success("Post published successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
      if (error.response?.status === 429) {
        toast.error("You’re posting too fast — slow down ⏳");
      } else {
        toast.error("Failed to publish post");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/40 to-white text-base-content">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-24">
        {/* Back Button */}
        <Link
          to="/"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>

        {/* Card */}
        <div className="bg-white border border-blue-100 rounded-2xl shadow-sm hover:shadow-md transition-all p-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-6">
            Create a New Blog Post
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                placeholder="Enter your post title"
                className="w-full bg-white border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Content */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Content
              </label>
              <textarea
                placeholder="Write your story here..."
                className="w-full bg-white border border-blue-200 rounded-lg px-4 py-3 h-44 resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. design, productivity, travel"
                className="w-full bg-white border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Featured Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-700 border border-blue-200 rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mt-4 rounded-lg w-full h-56 object-cover border border-blue-100"
                />
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg text-white font-medium transition-all duration-200"
              >
                {loading ? "Publishing..." : "Publish Post"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreatePage;
