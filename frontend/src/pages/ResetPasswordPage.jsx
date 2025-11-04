import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { Lock } from "lucide-react";

export default function ResetPasswordPage() {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${id}/${token}`, { password });
      toast.success("Password changed successfully. Please log in.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="w-full max-w-md bg-white border border-blue-100 rounded-2xl p-8 shadow-md hover:shadow-lg transition-all">
        <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">
          Reset Password
        </h2>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
                required
                className="w-full border border-blue-200 rounded-lg px-4 py-2 pl-10 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
              />
              <Lock
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
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          <span
            onClick={() => navigate("/login")}
            className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to Login
          </span>
        </p>
      </div>
    </div>
  );
}
