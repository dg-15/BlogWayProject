import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { LogOut, Save, Heart, Home } from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { useNavigate, Link } from "react-router-dom";

const ProfilePage = () => {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [userPosts, setUserPosts] = useState([]);

  // Fetch profile and posts
  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      try {
        const res = await api.get("/auth/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setFormData({ name: res.data.name, email: res.data.email });

        const postsRes = await api.get("/posts");
        const myPosts = postsRes.data.filter(
          (p) => p.author?._id === res.data._id || p.author === res.data._id
        );
        setUserPosts(myPosts);
      } catch (error) {
        console.error("Error fetching profile/posts:", error);
        toast.error("Failed to load profile or posts");
      } finally {
        setFetching(false);
      }
    };
    fetchProfileAndPosts();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put(
        "/auth/profile",
        { name: formData.name, email: formData.email },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      toast.success("Profile updated successfully!");
      setFormData({ name: res.data.name, email: res.data.email });
      setUser(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-blue-600 text-xl">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-white px-4 py-10 text-gray-800">
      <div className="w-full max-w-md bg-white border border-blue-100 rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-200 mb-8">
        <h2 className="text-3xl font-semibold text-center text-blue-600 mb-8">
          My Profile
        </h2>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={handleLogout}
              type="button"
              className="flex items-center gap-2 px-5 py-2 border border-blue-300 text-blue-600 hover:text-red-500 hover:border-red-400 font-semibold rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </form>
      </div>

      {/* 🔹 My Posts List */}
      <div className="w-full max-w-2xl bg-white border border-blue-100 rounded-2xl p-6 shadow-md mb-6">
        <h3 className="text-xl font-semibold text-blue-700 mb-4">
          My Posts ({userPosts.length})
        </h3>

        {userPosts.length === 0 ? (
          <p className="text-gray-500 text-center">
            You haven’t created any posts yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {userPosts.map((post) => {
              const likesArray = Array.isArray(post.likedBy)
                ? post.likedBy
                : [];
              const likeCount = post.likes || likesArray.length || 0;

              return (
                <li
                  key={post._id}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                >
                  <Link
                    to={`/posts/${post._id}`}
                    className="font-medium text-gray-800 line-clamp-1 hover:underline underline-offset-2"
                  >
                    {post.title}
                  </Link>
                  <div className="flex items-center gap-1 text-blue-600">
                    <Heart className="w-4 h-4 fill-red-500" />
                    <span>{likeCount}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* 🏠 Back to Home Button */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition"
      >
        <Home className="w-4 h-4" />
        Back to Home
      </button>
    </div>
  );
};

export default ProfilePage;
