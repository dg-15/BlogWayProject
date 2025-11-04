import { useState } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { email });
      toast.success("Reset link sent — check your email");
      setSent(true);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="w-full max-w-md bg-white border border-blue-100 rounded-2xl p-8 shadow-md hover:shadow-lg transition-all">
        <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">
          Forgot Password
        </h2>

        {!sent ? (
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your account email"
                  required
                  className="w-full border border-blue-200 rounded-lg px-4 py-2 pl-10 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                />
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400/70"
                  size={18}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <p className="text-sm text-center text-gray-600">
            If an account exists with that email, a reset link has been sent.
          </p>
        )}

        <div className="text-center mt-6 text-sm text-gray-600">
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
