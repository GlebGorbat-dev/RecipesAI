"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { HashLink } from "@/lib/hashRouter";
import { API_URL } from "@/lib/api";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/v1/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: password }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(typeof d.detail === "string" ? d.detail : "Request failed");
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <p className="text-red-600">Invalid or missing reset token.</p>
        <HashLink href="#/" className="text-amber-600 hover:underline">
          Back to Sign In
        </HashLink>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-amber-50/30 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-amber-900">Reset Password</h1>
        {success ? (
          <p className="text-gray-800">Password has been reset successfully. You can now sign in.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <div className="rounded bg-red-100 px-3 py-2 text-sm text-red-700">{error}</div>}
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="rounded-lg bg-amber-600 py-2 font-semibold text-white transition hover:bg-amber-700"
            >
              Reset password
            </button>
          </form>
        )}
        <HashLink href="#/" className="mt-4 block text-sm text-amber-700 hover:underline">
          Back to Sign In
        </HashLink>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><p className="text-amber-900">Loading...</p></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
