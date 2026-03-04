"use client";

import { useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/v1/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(typeof d.detail === "string" ? d.detail : "Request failed");
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-amber-50/30 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-amber-900">Forgot Password</h1>
        {sent ? (
          <p className="text-gray-800">
            If the email exists, a password reset link has been sent.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <div className="rounded bg-red-100 px-3 py-2 text-sm text-red-700">{error}</div>}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="rounded-lg bg-amber-600 py-2 font-semibold text-white transition hover:bg-amber-700"
            >
              Send reset link
            </button>
          </form>
        )}
        <Link href="/" className="mt-4 block text-sm text-amber-700 hover:underline">
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
