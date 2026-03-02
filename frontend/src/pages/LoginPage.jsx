import { useState } from "react";
import api from "../lib/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, LogIn } from "lucide-react";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/auth/login", formData);
      const { token, name, email, _id } = res.data;
      login({ name, email, _id }, token);
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white text-gray-800 px-4 relative">
      <div className="w-full max-w-md bg-white border border-blue-100 rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-200">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">BlogWay</h1>
          <p className="text-sm text-gray-500 mt-2">
            Sign in to continue your blogging journey
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
              className="w-full bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 pr-10 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="absolute right-3 top-8 text-gray-500 hover:text-blue-600 transition"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50"
          >
            <LogIn size={18} />
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600 mt-4">
            New here?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Create an account
            </Link>
          </p>
        </form>
        {/* Test Credentials */}
        <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="text-xs text-gray-500 mb-1">🧪 Test Credentials</p>
          <p className="text-xs text-blue-600">Email: test@gmail.com</p>
          <p className="text-xs text-blue-600">Password: test123</p>
        </div>
      </div>

      {/* Footer text */}
      <div className="absolute bottom-6 text-xs text-gray-500 text-center px-4">
        By continuing, you agree to our{" "}
        <span className="text-blue-600 font-medium">Terms</span> &{" "}
        <span className="text-blue-600 font-medium">Privacy Policy</span>.
      </div>
    </div>
  );
};

export default LoginPage;
