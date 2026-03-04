"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { HashLink } from "@/lib/hashRouter";
import { API_URL } from "@/lib/api";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!sessionId || !token) {
      setStatus("success");
      return;
    }
    fetch(`${API_URL}/api/v1/payments/verify-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ session_id: sessionId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Verification failed");
        setStatus("success");
      })
      .catch(() => {
        setStatus("success");
      });
  }, [searchParams]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-amber-50/30 px-4">
      <div className="rounded-xl bg-white p-8 text-center shadow-lg">
        {status === "verifying" ? (
          <>
            <h1 className="mb-2 text-2xl font-bold text-amber-600">Activating Premium...</h1>
            <p className="mb-6 text-gray-600">Please wait while we confirm your payment.</p>
          </>
        ) : (
          <>
            <h1 className="mb-2 text-2xl font-bold text-green-600">Payment successful!</h1>
            <p className="mb-6 text-gray-600">Your Premium subscription is now active. Enjoy unlimited AI requests.</p>
          </>
        )}
        <HashLink
          href="#/profile"
          className="inline-block rounded-lg bg-amber-600 px-6 py-2 font-semibold text-white transition hover:bg-amber-700"
        >
          View Profile
        </HashLink>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><p className="text-amber-600">Loading...</p></div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
