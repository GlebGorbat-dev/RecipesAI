"use client";

import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-amber-50/30 px-4">
      <div className="rounded-xl bg-white p-8 text-center shadow-lg">
        <h1 className="mb-2 text-2xl font-bold text-amber-900">Payment cancelled</h1>
        <p className="mb-6 text-gray-600">Your payment was cancelled. You can upgrade to Premium anytime.</p>
        <Link
          href="/profile"
          className="inline-block rounded-lg bg-amber-600 px-6 py-2 font-semibold text-white transition hover:bg-amber-700"
        >
          Back to Profile
        </Link>
      </div>
    </div>
  );
}
