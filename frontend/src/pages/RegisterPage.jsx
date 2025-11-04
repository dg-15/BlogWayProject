import { useState } from "react";
import api from "../lib/axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, UserPlus } from "lucide-react";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/auth/register", formData);
      toast.success("Account created — please log in");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="w-full max-w-md bg-white border border-blue-100 rounded-2xl p-8 shadow-md hover:shadow-lg transition-all">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Join BlogWay</h1>
          <p className="text-sm text-gray-500 mt-2">
            Start your writing journey here.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Full name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-blue-200 rounded-lg px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
              placeholder="Your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-blue-200 rounded-lg px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-blue-200 rounded-lg px-4 py-2 pr-10 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="absolute right-3 top-8 text-gray-500 hover:text-blue-500 transition"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50"
          >
            <UserPlus size={18} />
            {loading ? "Creating account..." : "Create account"}
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>

      <div className="absolute bottom-6 text-xs text-gray-500 text-center px-4">
        By continuing, you agree to our{" "}
        <span className="text-blue-600">Terms</span> &{" "}
        <span className="text-blue-600">Privacy Policy</span>.
      </div>
    </div>
  );
};

export default RegisterPage;
