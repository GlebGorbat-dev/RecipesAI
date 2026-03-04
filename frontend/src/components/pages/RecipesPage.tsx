"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import AppHeader from "@/components/AppHeader";
import { HashLink } from "@/lib/hashRouter";
import { assetPath } from "@/lib/api";

const MOCK_RECIPES = [
  { id: "1", title: "Classic Carbonara", excerpt: "Creamy Italian pasta with eggs, cheese, and guanciale. A Roman staple that comes together in minutes.", image: assetPath("/images/recipes/carbonara.webp") },
  { id: "2", title: "Tomato Basil Bruschetta", excerpt: "Fresh tomatoes, basil, and garlic on toasted bread. Perfect as an appetizer or light snack.", image: assetPath("/images/recipes/tom_basil.webp") },
  { id: "3", title: "Chocolate Brownies", excerpt: "Rich, fudgy brownies with a crackly top. Simple ingredients, maximum chocolate flavor.", image: assetPath("/images/recipes/brownie.webp") },
  { id: "4", title: "Russian Borsch", excerpt: "Classic Eastern European beetroot soup with beef, cabbage, and sour cream. Hearty and warming.", image: assetPath("/images/recipes/borsch.webp") },
  { id: "5", title: "Pasta Bolognese", excerpt: "Traditional Italian meat sauce with tomatoes, ground beef, and herbs. Served over spaghetti or tagliatelle.", image: assetPath("/images/recipes/bolognese.webp") },
  { id: "6", title: "Easy Lasagna", excerpt: "Layers of pasta, rich meat sauce, and creamy cheese. A crowd-pleasing comfort food ready with minimal fuss.", image: assetPath("/images/recipes/lasagna.webp") },
  { id: "7", title: "Napoleon cake", excerpt: "Napoleon Cake is a popular Eastern European dessert, often considered a variation of Mille-Feuille in France or Cremeschnitte in Romania.", image: assetPath("/images/recipes/napoleon.webp") },
  { id: "8", title: "Pizza Pepperoni", excerpt: "Classic pepperoni pizza.", image: assetPath("/images/recipes/pepperoni.jpg") },
  { id: "9", title: "Chicken curry", excerpt: "Western style curry.", image: assetPath("/images/recipes/curry.webp") },
  { id: "10", title: "Italian Tiramisu", excerpt: "Transport yourself to Italy with this classic Tiramisu recipe.", image: assetPath("/images/recipes/tiramisu.webp") },
];

export default function RecipesPage() {
  const { token, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !token) {
      window.location.hash = "#/";
    }
  }, [token, isLoading]);

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

      <main className="mx-auto max-w-4xl px-3 py-6 sm:px-4 sm:py-12">
        <h1 className="mb-4 text-2xl font-bold text-stone-900 sm:mb-8 sm:text-3xl">Recipes</h1>
        <p className="mb-6 text-sm text-gray-800 sm:mb-10 sm:text-base">
          Browse our collection of recipes. Click on any card to see the full recipe and cooking steps.
        </p>

        <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {MOCK_RECIPES.map((r) => (
            <HashLink
              key={r.id}
              href={`/recipes/${r.id}`}
              className="group block overflow-hidden rounded-xl border border-amber-200/80 bg-white shadow-sm transition hover:shadow-md hover:border-amber-300"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-amber-100">
                <img
                  src={r.image}
                  alt={r.title}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-4 sm:p-6">
                <h2 className="mb-1 text-base font-semibold text-stone-900 group-hover:text-amber-700 sm:mb-2 sm:text-lg">{r.title}</h2>
                <p className="line-clamp-3 text-xs text-gray-700 sm:text-sm">{r.excerpt}</p>
                <span className="mt-2 inline-block text-xs font-medium text-amber-600 group-hover:underline sm:mt-3 sm:text-sm">View recipe →</span>
              </div>
            </HashLink>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-gray-700 sm:mt-12 sm:text-sm">More recipes coming soon.</p>
      </main>
    </div>
  );
}
