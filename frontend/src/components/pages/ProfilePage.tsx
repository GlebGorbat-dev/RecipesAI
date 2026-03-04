"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AppHeader from "@/components/AppHeader";
import { HashLink } from "@/lib/hashRouter";
import { API_URL } from "@/lib/api";

interface User {
  id: number;
  email: string;
  username: string;
  full_name: string | null;
  is_active: boolean;
  created_at: string;
}

interface Subscription {
  plan: string;
  is_premium: boolean;
  ai_requests_limit_per_hour: number | null;
  current_period_end: string | null;
}

export default function ProfilePage() {
  const { token, isLoading } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingPremium, setLoadingPremium] = useState(false);

  useEffect(() => {
    if (!isLoading && !token) {
      window.location.hash = "#/";
    }
  }, [token, isLoading]);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/api/v1/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setSubscription(data.subscription);
      })
      .finally(() => setLoadingData(false));
  }, [token]);

  const handlePremium = async () => {
    if (!token) return;
    setLoadingPremium(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/payments/create-subscription`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        throw new Error("No checkout URL");
      }
    } catch {
      setLoadingPremium(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-stone-900">Loading...</div>
      </div>
    );
  }

  if (!token) return null;

  return (
    <div className="min-h-screen bg-amber-50">
      <AppHeader />
      <main className="mx-auto max-w-2xl px-3 py-6 sm:px-4 sm:py-12">
        <h1 className="mb-6 text-2xl font-bold text-stone-900 sm:mb-8 sm:text-3xl">Profile</h1>

        {loadingData ? (
          <p className="text-gray-800">Loading profile...</p>
        ) : (
          <div className="space-y-6">
            {user && (
              <div className="rounded-xl border border-amber-200/80 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-stone-900">User</h2>
                <p className="text-gray-700">Email: {user.email}</p>
                <p className="text-gray-700">Username: {user.username}</p>
                {user.full_name && <p className="text-gray-700">Name: {user.full_name}</p>}
              </div>
            )}
            {subscription && (
              <div className="rounded-xl border border-amber-200/80 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-stone-900">Subscription</h2>
                <p className="text-gray-700">Plan: {subscription.plan}</p>
                <p className="text-gray-700">
                  Status: {subscription.is_premium ? "Premium (unlimited)" : "Free"}
                </p>
                {!subscription.is_premium && subscription.ai_requests_limit_per_hour !== null && (
                  <p className="text-gray-700">
                    AI requests: {subscription.ai_requests_limit_per_hour} per hour
                  </p>
                )}
                {subscription.current_period_end && (
                  <p className="text-gray-700">
                    Current period ends: {new Date(subscription.current_period_end).toLocaleDateString()}
                  </p>
                )}
                {!subscription.is_premium && (
                  <button
                    onClick={handlePremium}
                    disabled={loadingPremium}
                    className="mt-4 rounded-lg bg-amber-600 px-6 py-2 font-semibold text-white transition hover:bg-amber-700 disabled:opacity-50"
                  >
                    {loadingPremium ? "Loading..." : "Upgrade to Premium"}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        <HashLink href="#/recipes" className="mt-8 inline-block font-medium text-amber-800 hover:underline">
          ← Back to Recipes
        </HashLink>
      </main>
    </div>
  );
}
