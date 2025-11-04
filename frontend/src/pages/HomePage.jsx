import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";
import toast from "react-hot-toast";
import api from "../lib/axios";
import PostCard from "../components/PostCard";
import PostsNotFound from "../components/PostsNotFound";

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState("All");
  const [authorFilter, setAuthorFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentUser, setCurrentUser] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = {};

      if (selectedTag !== "All") params.tag = selectedTag;
      if (authorFilter.trim()) params.author = authorFilter.trim();
      if (sortBy === "likes") params.sortBy = "likes";

      const res = await api.get("/posts", { params });
      setPosts(res.data);
      setIsRateLimited(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      if (error.response?.status === 429) setIsRateLimited(true);
      else toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  // simulate logged in user (for demo, replace with your auth context)
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setCurrentUser(JSON.parse(userData));
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [selectedTag, authorFilter, sortBy]);

  // Collect unique tags
  const allTags = ["All", ...new Set(posts.flatMap((p) => p.tags || []))];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white text-base-content">
      <Navbar />
      {isRateLimited && <RateLimitedUI />}

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto text-center pt-16 pb-8 px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4 leading-tight">
          Stories that Inspire, Ideas that Ignite
        </h1>
        <p className="text-base-content/70 text-lg max-w-2xl mx-auto">
          Explore perspectives on design, technology, creativity, and life from
          our growing community of thinkers.
        </p>
      </section>

      {/* Filter Controls */}
      <div className="sticky top-[72px] z-20 bg-white/80 backdrop-blur-md border-y border-blue-100 py-3">
        <div className="flex flex-wrap items-center justify-center gap-4 px-4 max-w-5xl mx-auto">
          {/* Tag Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 text-sm rounded-full border transition-all duration-200 ${
                  selectedTag === tag
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white border-blue-200 text-blue-700 hover:bg-blue-50"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Author Filter */}
          <input
            type="text"
            placeholder="Search by author..."
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
            className="px-4 py-2 text-sm border border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
          />

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 text-sm border border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="newest">Newest</option>
            <option value="likes">Most Liked</option>
          </select>
        </div>
      </div>

      {/* Main Feed */}
      <main className="max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Loading Skeleton */}
        {loading && (
          <div className="flex flex-col gap-6 py-10">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-40 bg-blue-100/30 animate-pulse rounded-xl border border-blue-100"
              ></div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && !isRateLimited && <PostsNotFound />}

        {/* Vertical Feed */}
        {!loading && posts.length > 0 && !isRateLimited && (
          <div className="flex flex-col gap-8">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                setPosts={setPosts}
                currentUser={currentUser}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
