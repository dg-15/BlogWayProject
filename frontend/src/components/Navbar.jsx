// import React from "react";
// import { Link } from "react-router-dom";
// import { PenLine, UserIcon, LogOut, Home } from "lucide-react";
// import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PenLine, UserIcon, LogOut, Home } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/axios";
//import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout, setUser } = useAuth();
  const [profile, setProfile] = useState(user);

  // ✅ Fetch profile once to ensure correct data (like in ProfilePage)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await api.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(res.data);
        setUser(res.data); // sync with context
      } catch (err) {
        console.error("Error fetching navbar profile:", err);
      }
    };

    if (!profile?.name) fetchProfile();
  }, []);

  // ✅ Extract name and initial safely
  const displayName =
    profile?.name ||
    user?.name ||
    user?.user?.name ||
    user?.email?.split?.("@")?.[0] ||
    "User";

  const initial = displayName?.trim()?.[0]?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 bg-base-100/90 backdrop-blur-md border-b border-base-300 shadow-sm transition-colors duration-200">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        {/* Left: Brand */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-primary hover:text-primary/80 transition-colors duration-200"
        >
          BlogWay
        </Link>

        {/* Right: Navigation */}
        <div className="flex items-center gap-5">
          {/* Home */}
          <Link
            to="/"
            className="flex items-center gap-1 text-info font-medium hover:text-info/80 transition-colors"
          >
            <Home size={18} /> <span className="hidden sm:inline">Home</span>
          </Link>

          {/* Write */}
          <Link
            to="/create"
            className="flex items-center gap-2 bg-primary text-primary-content font-medium px-4 py-2 rounded-lg shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all duration-200"
          >
            <PenLine className="w-5 h-5" />
            <span>Write</span>
          </Link>

          {/* Profile */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar hover:scale-105 transition-transform"
            >
              <div className="bg-info text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md">
                <span className="text-lg font-semibold">
                  {initial}
                </span>
              </div>
            </div>

            {/* Dropdown menu */}
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 border border-base-300 rounded-xl mt-3 w-52 p-2 shadow-lg"
            >
              <li className="px-3 py-2 text-sm text-base-content/70 border-b border-base-300">
                👋 Hi,{" "}
                <span className="font-semibold text-info">
                  {user?.name || "User"}
                </span>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 hover:bg-base-200 rounded-md px-3 py-2 transition-colors"
                >
                  <UserIcon size={16} /> Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-error hover:bg-error/10 rounded-md px-3 py-2 transition-colors"
                >
                  <LogOut size={16} /> Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
