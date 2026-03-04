"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { assetPath } from "@/lib/api";
import AppHeader from "@/components/AppHeader";
import { HashLink } from "@/lib/hashRouter";

const MOCK: Record<string, { title: string; excerpt: string; content: string; image: string }> = {
  "1": {
    title: "Classic Carbonara",
    excerpt: "Creamy Italian pasta with eggs, cheese, and guanciale.",
    image: assetPath("/images/recipes/carbonara.webp"),
    content: `Spaghetti Carbonara is an iconic Italian pasta dish that has gained popularity all around the world. With its rich and creamy sauce, savory pancetta, and perfectly cooked pasta, this recipe is a true delight for pasta lovers.

Ingredients:
8 ounces (225g) spaghetti
4 ounces (115g) pancetta or bacon, diced
3 large egg yolks
1/2 cup grated Pecorino Romano cheese
1/2 cup grated Parmesan cheese
2 garlic cloves, minced
Freshly ground black pepper
Salt to taste
Fresh parsley, chopped (for garnish)

Instructions:

Cook the Spaghetti:
Fill a large pot with water and bring it to a boil. Add salt to the boiling water. Cook the spaghetti according to the package instructions until al dente. Drain the spaghetti, reserving some of the cooking water.

Prepare the Sauce:
In a large skillet, cook the pancetta or bacon over medium heat until crispy and golden brown. Remove the pancetta from the skillet, leaving the rendered fat behind.

Create the Carbonara Mixture:
In a bowl, whisk together the egg yolks, grated Pecorino Romano cheese, grated Parmesan cheese, minced garlic, and freshly ground black pepper. Whisk until well combined.

Combine and Toss:
Place the drained spaghetti into the skillet with the rendered pancetta fat. Toss until well coated. Remove the skillet from the heat and quickly pour the egg and cheese mixture over the spaghetti. Toss vigorously. If the sauce seems too thick, add a small amount of reserved pasta water.

Serve and Garnish:
Divide among serving plates. Garnish with grated Pecorino Romano, black pepper, and chopped parsley.`,
  },
  "2": {
    title: "Tomato Basil Bruschetta",
    excerpt: "Fresh tomatoes, basil, and garlic on toasted bread.",
    image: assetPath("/images/recipes/tom_basil.webp"),
    content: `Delicious and tender tomato bruschetta is considered the hallmark of Italy. These crispy sandwiches are famous worldwide. When prepared correctly, this appetizer should have a fresh, rich flavor.

Ingredients:
Ciabatta - 4 slices
Tomatoes - 2 pcs
Fresh basil - 10 leaves
Garlic - 2 cloves
Olive oil - to taste
Salt and ground black pepper - to taste

Directions:
Wash and dry the tomatoes, remove the stems. Make a cross-shaped cut on the back. Scald the tomatoes with boiling water. Remove the skin. Cut the tomato into quarters, scoop out the liquid part with the seeds. Dice the pulp and place it in a deep bowl.

Wash the basil leaves, dry them, and cut them into small pieces. Add them to the tomato. Add olive oil, salt, and ground black pepper to the filling.

Grind the ciabatta slices with a little olive oil and toast them on the grill or in a frying pan. As soon as the slices have a delicious crust, rub them with garlic on one side. Pour the filling onto the bread. Serve the bruschetta immediately!`,
  },
  "3": {
    title: "Chocolate Brownies",
    excerpt: "Rich, fudgy brownies with a crackly top.",
    image: assetPath("/images/recipes/brownie.webp"),
    content: `Chocolate Brownie – can be made in the oven or microwave.

Ingredients:
Sieved Flour 3 Tablespoons
Sugar 3 Tablespoon (Ground)
Cocoa Powder 2 Tablespoon
Baking powder 1 Teaspoon
Cooking Oil 2 Tablespoon
One Pinch of Salt
Milk 5 Tablespoon
Vanilla essence (Optional)

Process:
Combine dry ingredients: flour, ground sugar, cocoa powder, baking powder, and a pinch of salt in a mixing bowl. Stir until uniform.

Add vanilla extract (optional), oil, and milk. Mix gradually until you get a brown paste. Add more milk if needed.

Transfer to a temperature-resistant bowl. Bake in the oven for 1 minute 20 seconds (or microwave). Don't cover.

The brownie should be slightly moist when cooled. Cut into pieces and serve with ice cream of your choice.`,
  },
  "4": {
    title: "Russian Borsch",
    excerpt: "Classic Eastern European beetroot soup with beef, cabbage, and sour cream.",
    image: assetPath("/images/recipes/borsch.webp"),
    content: `Borsch is the famous soup in many Russian families, as well as many Eastern and Central European countries. Vegetables (mainly beet) and sour cream are always the main ingredients.

Ingredients:
4 qt. water
14 oz. beef stock
1 small head of cabbage
5 large potatoes
1 large carrot
1 med. beet root
1 med. onion
1 bay leaf
2 tablespoons tomato paste
3-5 cloves garlic
Parsley, dill, etc.
Sour cream

Preparation:
1. Boil the beef stock for at least 1.5 hours, strain the broth, separate the meat from the bone and carve it.
2. Peel the raw beet root, cut it in thin two-inch strips and stew for half an hour.
3. Add cubed potatoes in the boiling broth. Add the stewed beet when the broth boils again. Add bay leaf.
4. Cut the carrot the same way as the beet root, fry it and add into borsch.
5. Slice the onion, fry on both sides, add tomato paste. Mix and fry for some more time.
6. Take the fried onion off the stove and add mashed garlic.
7. Shred the cabbage finely and add into borsch when the potato is almost cooked.
8. Cover and boil for 5 minutes. Add fried onion with garlic and seasonings. Mix. Cover and cook for 3 more minutes. Add cut verdure.
9. Take borsch off the stove and leave uncovered.

Tips: Sour cream is served separately or added right before serving.`,
  },
  "5": {
    title: "Pasta Bolognese",
    excerpt: "Traditional Italian meat sauce with tomatoes, ground beef, and herbs.",
    image: assetPath("/images/recipes/bolognese.webp"),
    content: `Pasta Bolognese – a classic Italian favorite.

Ingredients:
1 lb (450g) ground beef, 1 onion, 2 carrots, 2 celery stalks, 3 cloves garlic, crushed tomatoes, red wine, beef broth, tomato paste, olive oil, oregano, basil, nutmeg, milk, spaghetti, Parmesan.

Instructions:
1. Sauté onions, carrots, celery. Add garlic.
2. Add ground beef and brown. Add wine, let evaporate.
3. Add tomatoes, paste, broth, oregano, basil, nutmeg. Simmer 1 hour.
4. Add milk 10 min before serving.
5. Cook spaghetti. Serve with sauce and Parmesan.`,
  },
  "6": {
    title: "Easy Lasagna",
    excerpt: "Layers of pasta, rich meat sauce, and creamy cheese.",
    image: assetPath("/images/recipes/lasagna.webp"),
    content: `Easy Lasagna – simple and delicious.

Ingredients: Onion, garlic, tomato sauce, olive oil, ground meat, diced tomatoes, ricotta, lasagna noodles, seasonings.

Instructions:
1. Make tomato sauce: sauté onion and garlic, add paste, water, wine, seasonings. Simmer 15 min.
2. Mix ricotta, mozzarella, Parmesan.
3. Layer noodles, meat, sauce, cheese. Repeat 3 times.
4. Bake until bubbling. Let cool.`,
  },
  "7": {
    title: "Napoleon cake",
    excerpt: "Multiple thin layers of puff pastry with diplomat cream.",
    image: assetPath("/images/recipes/napoleon.webp"),
    content: `Napoleon cake: puff pastry layers with diplomat cream (pastry cream + whipped cream). Bake layers, assemble with cream, refrigerate overnight.`,
  },
  "8": {
    title: "Pizza Pepperoni",
    excerpt: "Classic pepperoni pizza.",
    image: assetPath("/images/recipes/pepperoni.jpg"),
    content: `Pepperoni pizza: dough, tomato sauce, mozzarella, pepperoni. Bake at 220°C for 15-20 min.`,
  },
  "9": {
    title: "Chicken Curry",
    excerpt: "Western style chicken curry.",
    image: assetPath("/images/recipes/curry.webp"),
    content: `Chicken curry: fry garlic, ginger, onion. Add chicken, curry powder. Add coconut milk and stock. Simmer. Add peas. Serve with rice.`,
  },
  "10": {
    title: "Italian Tiramisu",
    excerpt: "Espresso-soaked ladyfingers with mascarpone cream.",
    image: assetPath("/images/recipes/tiramisu.webp"),
    content: `Tiramisu: mix egg yolks, sugar, mascarpone. Fold in whipped whites. Layer soaked ladyfingers and cream. Refrigerate 4+ hours. Dust with cocoa.`,
  },
};

export default function RecipeDetailPage({ id }: { id: string }) {
  const { token, isLoading } = useAuth();
  const recipe = id ? MOCK[id] : undefined;

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

  if (!recipe) {
    return (
      <div className="min-h-screen bg-amber-50 px-4 py-12">
        <AppHeader />
        <HashLink href="#/recipes" className="font-medium text-amber-800 hover:underline">← Back to recipes</HashLink>
        <p className="mt-4 text-gray-800">Recipe not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <AppHeader />
      <main className="mx-auto max-w-2xl px-3 py-6 sm:px-4 sm:py-12">
        <HashLink href="#/recipes" className="mb-4 inline-block text-sm font-medium text-amber-800 hover:underline sm:mb-6 sm:text-base">← Back to recipes</HashLink>
        <div className="overflow-hidden rounded-xl border border-amber-200/80 bg-white shadow-sm">
          <div className="aspect-[16/9] w-full overflow-hidden bg-amber-100">
            <img src={recipe.image} alt={recipe.title} className="h-full w-full object-cover" loading="lazy" />
          </div>
        </div>
        <h1 className="mb-3 mt-5 text-2xl font-bold text-stone-900 sm:mb-4 sm:mt-8 sm:text-3xl">{recipe.title}</h1>
        <p className="mb-5 text-sm text-gray-800 sm:mb-8 sm:text-base">{recipe.excerpt}</p>
        <div className="rounded-lg border border-amber-200/80 bg-white p-4 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap font-sans sm:p-6 sm:text-base">
          {recipe.content}
        </div>
      </main>
    </div>
  );
}
