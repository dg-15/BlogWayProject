import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import PostDetailPage from "./pages/PostDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

const App = () => {
  return (
    <div className="relative h-full w-full">
      <div
        className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 
        [background:radial-gradient(125%_125%_at_50%_10%,#000_60%,#00FF9D40_100%)]"
      />

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreatePage />
            </ProtectedRoute>
          }
        />
        <Route path="/posts/:id" element={<PostDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/reset-password/:id/:token"
          element={<ResetPasswordPage />}
        />
      </Routes>
    </div>
  );
};

export default App;
