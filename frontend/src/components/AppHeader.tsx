"use client";

import { HashLink } from "@/lib/hashRouter";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { API_URL } from "@/lib/api";

export default function AppHeader() {
  const { token, logout } = useAuth();
  const [loadingPremium, setLoadingPremium] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <header className="border-b border-amber-200/60 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:py-4">
        <HashLink href="#/recipes" className="text-lg font-bold text-stone-900 sm:text-xl">
          Recipes Online
        </HashLink>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-3 sm:flex">
          <HashLink
            href="#/ask"
            className="rounded-lg bg-amber-500 px-4 py-2 font-medium text-white transition hover:bg-amber-600"
          >
            Ask AI
          </HashLink>
          <button
            onClick={handlePremium}
            disabled={loadingPremium}
            className="rounded-lg border-2 border-amber-500 px-4 py-2 font-medium text-amber-800 transition hover:bg-amber-50 disabled:opacity-50"
          >
            {loadingPremium ? "Loading..." : "Premium"}
          </button>
          <HashLink href="#/profile" className="text-sm text-gray-700 hover:text-stone-900">
            Profile
          </HashLink>
          <button onClick={logout} className="text-sm text-gray-700 hover:text-stone-900">
            Sign Out
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-stone-700 hover:bg-amber-100 sm:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav className="flex flex-col gap-2 border-t border-amber-200/60 bg-white px-4 pb-4 pt-3 sm:hidden">
          <HashLink
            href="#/ask"
            onClick={() => setMenuOpen(false)}
            className="rounded-lg bg-amber-500 px-4 py-2.5 text-center font-medium text-white transition hover:bg-amber-600"
          >
            Ask AI
          </HashLink>
          <button
            onClick={() => { setMenuOpen(false); handlePremium(); }}
            disabled={loadingPremium}
            className="rounded-lg border-2 border-amber-500 px-4 py-2.5 font-medium text-amber-800 transition hover:bg-amber-50 disabled:opacity-50"
          >
            {loadingPremium ? "Loading..." : "Premium"}
          </button>
          <HashLink
            href="#/profile"
            onClick={() => setMenuOpen(false)}
            className="rounded-lg px-4 py-2.5 text-center text-gray-700 transition hover:bg-amber-50"
          >
            Profile
          </HashLink>
          <button
            onClick={() => { setMenuOpen(false); logout(); }}
            className="rounded-lg px-4 py-2.5 text-gray-700 transition hover:bg-amber-50"
          >
            Sign Out
          </button>
        </nav>
      )}
    </header>
  );
}
