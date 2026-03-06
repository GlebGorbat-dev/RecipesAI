"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getHashHref, getHashRedirectUrl } from "@/lib/hashRouter";
import { API_URL } from "@/lib/api";

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
    const sentKey = `oauth_sent_${code}`;
    if (typeof window !== "undefined" && sessionStorage.getItem(sentKey)) {
      return;
    }
    sessionStorage.setItem(sentKey, "1");
    let cancelled = false;
    const controller = new AbortController();
    fetch(`${API_URL}/api/v1/auth/google/callback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, state }),
      signal: controller.signal,
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
        window.location.href = getHashRedirectUrl("/recipes");
      })
      .catch((err) => {
        if (!cancelled && err?.name !== "AbortError") {
          sessionStorage.removeItem(sentKey);
          setStatus("error");
          setError(err instanceof Error ? err.message : "Authentication failed");
        }
      });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [searchParams, setToken]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      {status === "loading" && <p className="text-xl text-amber-900">Signing in with Google...</p>}
      {status === "error" && (
        <>
          <p className="text-xl text-red-600">{error}</p>
          <a href={getHashRedirectUrl("/")} className="text-amber-600 hover:underline">
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
