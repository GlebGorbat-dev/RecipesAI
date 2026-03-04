"use client";

import { useHashPath } from "@/lib/hashRouter";
import HomePage from "@/components/pages/HomePage";
import RecipesPage from "@/components/pages/RecipesPage";
import RecipeDetailPage from "@/components/pages/RecipeDetailPage";
import AskPage from "@/components/pages/AskPage";
import ProfilePage from "@/components/pages/ProfilePage";
import ForgotPasswordPage from "@/components/pages/ForgotPasswordPage";

export default function HashRoutedPage() {
  const path = useHashPath();

  // Normalize: "/" or "" -> home
  const normalized = path === "" || path === "/" ? "/" : path.replace(/\/+$/, "");

  // /recipes/123 -> RecipeDetail with id 123
  const recipesMatch = normalized.match(/^\/recipes\/([^/]+)$/);
  if (recipesMatch) {
    return <RecipeDetailPage id={recipesMatch[1]} />;
  }

  switch (normalized) {
    case "/":
      return <HomePage />;
    case "/recipes":
      return <RecipesPage />;
    case "/ask":
      return <AskPage />;
    case "/profile":
      return <ProfilePage />;
    case "/auth/forgot-password":
      return <ForgotPasswordPage />;
    default:
      return <HomePage />;
  }
}
