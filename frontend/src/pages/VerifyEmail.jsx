import React, { useEffect, useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { useNavigate } from "react-router-dom";
import SharedHeader from "../components/SharedHeader";

function VerifyEmail() {
  const navigate = useNavigate();
  const [email] = useState(
    () => localStorage.getItem("pendingVerificationEmail") || "",
  );
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    const interval = setInterval(() => {
      checkAuth();
    }, 2000);

    return () => clearInterval(interval);
  }, [checkAuth]);

  useEffect(() => {
    // If user becomes authenticated, redirect to home
    if (isAuthenticated) {
      localStorage.removeItem("pendingVerificationEmail");
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleResendEmail = async () => {
    // You could implement resend functionality here if needed
    alert(
      "Please check your email for the verification link. If you haven't received it, try signing up again.",
    );
  };

  return (
    <div className="min-h-screen">
      <SharedHeader />
      <main className="max-w-md mx-auto mt-24 px-4">
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-600 mb-4">
              We've sent a verification link to{" "}
              <span className="font-medium text-gray-900">
                {email || "your email"}
              </span>
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Click the link in the email to verify your account and start
              shopping. The link will expire in 24 hours.
            </p>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>Didn't receive the email?</strong> Check your spam
                folder or try signing up again with the same email address.
              </p>
            </div>

            <button
              onClick={handleResendEmail}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              I Didn't Receive the Email
            </button>

            <button
              onClick={() => navigate("/auth")}
              className="w-full py-3 bg-purple-800 text-white rounded-lg font-semibold hover:bg-purple-900 transition"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default VerifyEmail;
