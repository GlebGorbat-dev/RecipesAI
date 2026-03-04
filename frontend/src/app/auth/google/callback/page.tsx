"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getHashHref } from "@/lib/hashRouter";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function GoogleCallbackContent() {
  const searchParams = useSearchParams();
  const { setToken } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    if (!code) {
      setStatus("error");
      setError("Missing authorization code");
      return;
    }
    let cancelled = false;
    fetch(`${API_URL}/api/v1/auth/google/callback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, state }),
    })
      .then(async (res) => {
        if (cancelled) return null;
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(typeof d.detail === "string" ? d.detail : "Authentication failed");
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled || !data) return;
        setToken(data.access_token);
        setStatus("success");
        window.location.href = getHashHref("/recipes");
      })
      .catch((err) => {
        if (!cancelled) {
          setStatus("error");
          setError(err instanceof Error ? err.message : "Authentication failed");
        }
      });
    return () => { cancelled = true; };
  }, [searchParams, setToken]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      {status === "loading" && <p className="text-xl text-amber-900">Signing in with Google...</p>}
      {status === "error" && (
        <>
          <p className="text-xl text-red-600">{error}</p>
          <a href={getHashHref("/")} className="text-amber-600 hover:underline">
            Back to home
          </a>
        </>
      )}
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><p className="text-xl text-amber-900">Loading...</p></div>}>
      <GoogleCallbackContent />
    </Suspense>
  );
}
