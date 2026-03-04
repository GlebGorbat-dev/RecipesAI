"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function HomePage() {
  const { token, login, register, forgotPassword, isLoading } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (showForgotPassword) {
        await forgotPassword(email);
        setSuccess("If the email exists, a password reset link has been sent.");
        setShowForgotPassword(false);
      } else if (isLogin) {
        await login(email, password);
        setShowModal(false);
        window.location.hash = "#/recipes";
      } else {
        await register(email, username, password);
        setShowModal(false);
        window.location.hash = "#/recipes";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-amber-900/90">Loading...</div>
      </div>
    );
  }

  if (token) {
    if (typeof window !== "undefined") window.location.hash = "#/recipes";
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-amber-900/90">Redirecting...</div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url(https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1920&q=80)",
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-7xl">
          Recipes Online
        </h1>
        <p className="mb-8 max-w-xl text-base text-white/95 drop-shadow-md sm:mb-10 sm:text-xl">
          Discover delicious recipes and get AI-powered cooking assistance.
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="rounded-lg bg-amber-500 px-6 py-2.5 text-base font-semibold text-white shadow-lg transition hover:bg-amber-600 sm:px-8 sm:py-3 sm:text-lg"
        >
          Sign In / Register
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              {showForgotPassword ? "Forgot Password" : isLogin ? "Sign In" : "Register"}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="rounded bg-red-100 px-3 py-2 text-sm text-red-700">{error}</div>
              )}
              {success && (
                <div className="rounded bg-green-100 px-3 py-2 text-sm text-green-700">{success}</div>
              )}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {!showForgotPassword && (
                <>
                  {!isLogin && (
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  )}
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={!showForgotPassword}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(true);
                        setError("");
                        setSuccess("");
                      }}
                      className="self-start text-sm text-amber-700 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </>
              )}
              <button
                type="submit"
                className="rounded-lg bg-amber-600 py-2 font-semibold text-white transition hover:bg-amber-700"
              >
                {showForgotPassword ? "Send reset link" : isLogin ? "Sign In" : "Register"}
              </button>
            </form>
            {showForgotPassword ? (
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setError("");
                  setSuccess("");
                }}
                className="mt-3 text-sm text-amber-700 hover:underline"
              >
                Back to Sign In
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setSuccess("");
                }}
                className="mt-3 text-sm text-amber-700 hover:underline"
              >
                {isLogin ? "Need an account? Register" : "Already have an account? Sign In"}
              </button>
            )}
            {!showForgotPassword && (
              <div className="mt-4">
                <a
                  href={`${API_URL}/api/v1/auth/google`}
                  className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 py-2 text-gray-700 transition hover:bg-gray-50"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign in with Google
                </a>
              </div>
            )}
            <button
              onClick={() => {
                setShowModal(false);
                setShowForgotPassword(false);
                setError("");
                setSuccess("");
              }}
              className="mt-4 block w-full text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
