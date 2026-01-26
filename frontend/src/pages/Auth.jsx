import React, { useState, useEffect } from "react";
import { useAuthStore } from "../stores/authStore";
import { Link, useNavigate } from "react-router-dom";
import SharedHeader from "../components/shared/SharedHeader";

function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const signup = useAuthStore((s) => s.signup);
  const login = useAuthStore((s) => s.login);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("credentials") || "null");
      if (saved && saved.email) {
        setEmail(saved.email || "");
        setPassword(saved.password || "");
        setRememberMe(true);
      }
    } catch (e) {
      // ignore malformed storage
      console.log(e.message);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in the required fields");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
        // Store email for verification
        localStorage.setItem("pendingVerificationEmail", email);
      }

      // Persist a minimal user marker locally for any non-store consumers
      try {
        localStorage.setItem("user", JSON.stringify({ email }));
      } catch (e) {
        console.log(e.message);
      }

      // Save or remove credentials depending on Remember Me
      try {
        if (rememberMe) {
          localStorage.setItem(
            "credentials",
            JSON.stringify({ email, password }),
          );
        } else {
          localStorage.removeItem("credentials");
        }
      } catch (e) {
        // ignore storage errors
        console.log(e.message);
      }

      // After signup, navigate to email verification; otherwise go home
      if (!isLogin) navigate("/verify-email");
      else navigate("/");
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || "Authentication failed");
      } else {
        setError("Network error, try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SharedHeader />
      <main className="max-w-md mx-auto mt-24 px-4">
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
            {isLogin ? "Welcome back" : "Create an account"}
          </h1>
          <p className="text-gray-600 mb-6">
            {isLogin
              ? "Sign in to continue to Lux By Stylish"
              : "Create your account to get started"}
          </p>

          {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-200 outline-none"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">
                Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-200 outline-none"
              />
            </label>

            {!isLogin && (
              <label className="block">
                <span className="text-sm font-medium text-gray-700">
                  Confirm Password
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-200 outline-none"
                />
              </label>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>
                <Link
                  to="/forgot"
                  className="text-sm text-amber-800 hover:underline"
                >
                  Forgot?
                </Link>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-purple-800 text-white rounded-lg font-semibold hover:bg-purple-900 transition"
              disabled={loading}
            >
              {loading
                ? isLogin
                  ? "Signing in..."
                  : "Creating..."
                : isLogin
                  ? "Sign in"
                  : "Create account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin((s) => !s)}
              className="text-amber-800 font-medium hover:underline"
              type="button"
            >
              {isLogin ? "Create one" : "Sign in"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
