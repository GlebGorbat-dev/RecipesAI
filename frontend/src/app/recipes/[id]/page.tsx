"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AppHeader from "@/components/AppHeader";

const MOCK: Record<string, { title: string; excerpt: string; content: string; image: string }> = {
  "1": {
    title: "Classic Carbonara",
    excerpt: "Creamy Italian pasta with eggs, cheese, and guanciale.",
    image: "/images/recipes/carbonara.webp",
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
    image: "/images/recipes/tom_basil.webp",
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
    image: "/images/recipes/brownie.webp",
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
    image: "/images/recipes/borsch.webp",
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

Tips: Sour cream is served separately or added right before serving. You may use veal or chicken instead of beef.`,
  },
  "5": {
    title: "Pasta Bolognese",
    excerpt: "Traditional Italian meat sauce with tomatoes, ground beef, and herbs.",
    image: "/images/recipes/bolognese.webp",
    content: `Pasta Bolognese – a classic Italian favorite.

Ingredients:
1 lb (450g) ground beef
1 onion, finely chopped
2 carrots, finely chopped
2 celery stalks, finely chopped
3 cloves garlic, minced
1 can (14 oz) crushed tomatoes
1/2 cup red wine (optional)
1 cup beef broth
2 tablespoons tomato paste
2 tablespoons olive oil
Salt and pepper to taste
1/2 teaspoon dried oregano
1/2 teaspoon dried basil
1/4 teaspoon nutmeg
1/2 cup whole milk
1 lb (450g) spaghetti
Grated Parmesan cheese for serving

Instructions:
1. Heat olive oil in a large pot. Add onions, carrots, and celery. Sauté until softened.

2. Add minced garlic and cook for 1–2 minutes.

3. Add ground beef and cook until browned. Break the meat apart with a spoon.

4. Pour in the wine (if using) and let it simmer until mostly evaporated.

5. Stir in crushed tomatoes, tomato paste, beef broth, oregano, basil, nutmeg, salt, and pepper. Bring to a simmer.

6. Reduce heat to low, cover, and simmer for at least 1 hour, stirring occasionally.

7. About 10 minutes before serving, add the milk and stir well.

8. Cook spaghetti according to package instructions. Drain. Serve the sauce over the pasta with grated Parmesan.`,
  },
  "6": {
    title: "Easy Lasagna",
    excerpt: "Layers of pasta, rich meat sauce, and creamy cheese.",
    image: "/images/recipes/lasagna.webp",
    content: `Easy Lasagna – simple and delicious.

Ingredients:
Chopped onion
Chopped garlic
Tomato sauce
Olive oil
Ground meat (optional)
Diced tomatoes
Ricotta cheese or shredded cheese
Precooked lasagna noodles
Seasonings

Instructions:
1. Prepare the tomato sauce: sauté onion and garlic in a pan over low to medium heat. Add tomato paste, water, wine, and seasonings. Simmer for about 15 minutes until the sauce thickens.

2. Ready the cheese: combine ricotta, shredded mozzarella, and Parmesan.

3. Assemble: layer lasagna noodles, meat (if using), sauce, and cheese. Repeat for about three layers.

4. Bake in a preheated oven until bubbling. Let cool a few minutes before serving.`,
  },
   "7": {
    title: "Napoleon cake",
    excerpt: "multiple thin layers of crisp, buttery layers of puff pastry dough filled\n" +
        "with rich, homemade diplomat cream",
    image: "/images/recipes/napoleon.webp",
    content: `Ingredients and substitutions
Puff pastry: In the words of the lovely Ina Garten, “Store-bought puff pastry is fine!” I typically
make this recipe with store-bought puff pastry. Store-bought puff pastry sheets are sold in the
refrigerator or freezer section at your local grocery store.

Egg yolks : You’ll need whole eggs, but we’ll be separating the yolks and whites for different parts
of the recipe. The egg yolks add richness to the diplomat cream, while the whipped egg whites are
folded in for lightness and structure. Be sure to use large eggs.

Sugar: Just enough sugar to satisfy your sweet tooth.

Corn starch: Corn starch helps thicken the pastry cream.

Vanilla bean pods: While vanilla pods are the classic, preferred choice for this dessert, you can
ubstitute it for two teaspoons of high-quality, pure vanilla extract or 1 Tablespoon of vanilla bean
paste.

Powdered sugar: For dusting and decoration.

Heavy cream: Use cold heavy whipping cream for best results. This helps the custard cream hold its
structure and creates a fluffy, stable texture. Avoid using light cream, condensed milk, Cool Whip,
sour cream, cream cheese, or half-and-half, which won’t whip properly.

What is diplomat cream?

Diplomat cream, also known as crème diplomate or diplomat custard, is a light, creamy filling used in
pastries and desserts like eclairs, cream puffs, and fruit tarts. It is made by combining pastry cream
(which is a thick custard made from milk, eggs, sugar, corn starch) and heavy whipping cream.
Unlike mousseline cream, which is made by combining pastry cream with softened butter (avoid cold
butter in this case), diplomat cream is lightened with heavy whipped cream for a softer, more delicate
finish.

How to make diplomat cream
The section below is a quick overview of how to make this recipe. For full details, see recipe card
below!

Cream the eggs

In a large bowl, whisk together egg yolks and sugar until light yellow in color. Then, add cornstarch
and whisk until smooth and thick.

Temper the eggs

Heat milk and vanilla in a medium saucepan over medium-low heat until steaming. Slowly add a little of
the hot milk mixture at a time to the eggs while whisking continuously.

Whisk the cream until thick

Pour the whole mixture through the sieve back into the pot. Gently whisk continuously for 5 to 7 minutes
until thickened. Remove from the heat. Add the bloomed gelatin and butter. Whisk together until combined.
While the custard is still warm, fold in the whipped egg whites until no more white is visible.

Set aside to cool

Directly cover the cream with plastic wrap to prevent a top layer of dry skin from forming. Place in
the refrigerator for a few hours until thick and chilled. Before using, give it a mix to smooth out
the texture as it will have set into a firm, thick custard.

After the custard is chilled, use a hand mixer to whip the heavy whipping cream on high speed. Fold
into same bowl as the custard until pale yellow, fluffy and thickened.

Note: Whisking the chilled custard will disrupt the gelatin but after assembling the cake and
refrigerating, it will set again.

How to make Napoleon Cake
The section below is a quick overview of how to make this recipe. For full details, see recipe index
card below!

Make the diplomat cream

See above for how to make diplomat cream. Full directions in recipe index card below.

Bake the layers

Use a rolling pin to flatten the puff pastry into a rectangle. Place the rolled out dough a baking
tray lined with a piece of parchment paper (a ‘prepared baking sheet’). Bake in a preheated oven at
425°F for 17 to 20 minutes until deep, golden brown. Press down the puff and remove the broken pieces.
Set aside for the topping later. Place the puff pastry back into the oven for an additional 5 to 7
minutes until even more golden brown and crispy.

Assemble

Cut each rectangle into two equal pieces to create thin cake layers. To assemble this layer cake,
start with one of the baked layers of puff pastry on your serving plate. Spread a generous amount of
cream on top to form one of the layers of pastry cream.

Repeat the process, alternating puff pastry and cream until you reach the next layer. Use any remaining
cream to cover the top and sides of the puff pastry cake layers. Finish by sprinkling the crushed puff
pastry pieces over the entire cake, gently pressing them into the cream for a decorative, bakery-style
finish.

Refrigerate

Cover the serving platter with plastic wrap and refrigerate for at least 4 to 5 hours but overnight is
best. This helps the cream set and the layers soften, making it easier to slice.`,
  },
    "8": {
    title: "Pizza Pepperoni",
    excerpt: "When it comes to classic comfort food, few dishes evoke the same universal delight as a perfectly crafted pepperoni pizza.",
    image: "/images/recipes/pepperoni.jpg",
    content: `I. Crafting the Perfect Pizza Dough
To kick off our pepperoni pizza adventure, let’s begin with the foundation — the dough.

Start by combining 3 cups of strong white bread flour, a teaspoon of sugar, a packet of instant yeast,
and a pinch of salt. Gradually add 1 1/4 cups of warm water and two tablespoons of olive oil, mixing
until a soft dough forms. Knead the dough for around 10 minutes until it’s smooth and elastic. Allow
it to rise in a covered bowl for an hour or until it doubles in size.

II. Savory Tomato Sauce Creation
A rich and flavorful tomato sauce is the heartbeat of any good pepperoni pizza.

In a pan, sauté finely chopped onions and garlic in olive oil until golden. Add a can of crushed
tomatoes, a pinch of sugar, salt, and dried oregano. Simmer the sauce for 20–30 minutes, allowing it
to thicken and intensify in flavor.

III. Selecting the Finest Cheese
For an authentic taste, go for a high-quality mozzarella cheese.

Grate fresh mozzarella for a melt-in-your-mouth texture. The creamy, stretchy consistency of this
cheese will elevate your pepperoni pizza to gourmet heights. Don’t be shy; be generous with the cheese —
it’s a crucial element in achieving that perfect balance of textures and flavors.

IV. Choosing the Right Pepperoni
opt for thinly sliced, high-quality pepperoni to infuse your pizza with a burst of spicy goodness.

The key is to distribute the pepperoni evenly, ensuring each slice gets its fair share of this iconic
topping. Whether you prefer a subtle smattering or a hearty coverage, the choice is yours. Remember,
the pepperoni is the hero here, so don’t hold back.

V. Assembling the Pizza
Roll out your risen dough on a floured surface to your desired thickness. Transfer it to a pizza stone
or baking tray. Spoon the tomato sauce over the dough, spreading it evenly. Sprinkle the grated
mozzarella generously, creating a luscious cheese blanket. Finally, arrange your chosen pepperoni slices
strategically to ensure every bite is a flavor explosion.

VI. Baking to Perfection
Preheat your oven to 220°C. Slide your pizza into the oven and let the magic happen. The crust should
turn golden, the cheese should bubble, and the pepperoni should crisp at the edges. This usually takes
around 15–20 minutes, but keep an eye on it to achieve your desired level of crispiness.

VII. The Irresistible Aromas
As the pepperoni pizza bakes, an irresistible aroma will waft through your kitchen, teasing your taste
buds and building anticipation. The combination of fresh dough, Savoury tomato sauce, melted cheese, and
sizzling pepperoni creates a sensory experience that is nothing short of divine.

VIII. Enjoy the Fruits of Your Labor
As you slice into your freshly baked pepperoni pizza, take a moment to revel in your culinary prowess.
The crispy crust, gooey cheese, and spicy pepperoni are a testament to your skill in the kitchen. Share
this delightful creation with friends and family, or savor it solo — either way, it’s a taste sensation
that’s hard to beat.

Your Pepperoni Pizza, Your Way
In conclusion, crafting the perfect pepperoni pizza is a delightful adventure that allows you to tailor
every element to your taste. From the dough’s texture to the spice level of your tomato sauce and the
abundance of cheese and pepperoni, each choice contributes to a uniquely satisfying culinary experience.
So, roll up your sleeves, preheat that oven, and embark on your own pepperoni pizza journey. Your taste
buds will thank you!`,
  },
  "9": {
    title: "Chicken Curry",
    excerpt: "his recipe is a Western style curry –\n" +
        "it’s not a traditional Indian curry, Thai curry, nor any other cuisine.",
    image: "/images/recipes/curry.webp",
    content: `What you need for Everyday Chicken Curry
Here’s what goes in this Everyday Chicken Curry.

Curry powder – the only spice you need! Any brand is fine here.

Garlic, ginger and onion – fresh aromatics add a flavour boost that makes all the difference with quick
curries! It’s the same when making quick Thai Green Curry or Red Curry using store bought paste.

Chicken broth/stock AND coconut milk – for creaminess and flavour. We’re just using 1 cup of coconut
milk here – this isn’t intended to be an overly rich, heavy coconut sauce.

Chicken – thighs are best because this curry needs to be simmered for 12 minutes for the flavours to
develop. But yes, it can be made with breast – but the steps need tweaking otherwise you’ll complain
that the chicken is dry!!

Peas – optional! Try other diced veg!

Coriander/cilantro – lovely freshness and flavour boost. Coriander haters – use chives or green onions
instead.

Curry Powders
These are the curry powders I currently have in my pantry – but I’ve used plenty of other brands in the
past. Curry powder is used in all sorts of recipes, not just Indian curries, including:

Thai Satay Chicken

Satay Chicken Curry – basically it’s chicken satay skewers in curry form, with loads of peanut sauce!

Chickpea Potato Curry – very popular with readers!

Curried Rice and Curried Sausages

Vegetable Curry and Cauliflower Curry

Singapore Noodles

Easy Thai Coconut Soup

How to make it
There’s nothing groundbreaking about how this chicken curry is made. The one key step is to fry off the
curry powder. This brightens up the flavour of the spices + creates more golden bits on the base of the
pan, and both of these things add more flavour into the curry sauce!

So don’t skip this step. 🙂

Make it your own!
This recipe is all about the curry sauce, so it’s really versatile in terms of what you can put in it,
as well as extra add ins. Here are some options:

Other proteins or vegetarian – make this with beef, lamb, pork, turkey, shrimp/prawns, fish or
vegetarian. See directions in the recipe notes;

Make it SPICY! This is not a spicy curry. So to add heat, either use HOT curry powder, or add cayenne
pepper or ground chilli powder;

Make it richer – use coconut cream instead of milk. Or use more coconut milk and simmer to reduce for
longer;

Add tomato paste to thicken the sauce a touch and make the sauce a darker colour. Use about 1.5 tbsp.

Try this curry with a side of Green Bean Salad, my friend JP’s famous Iceberg Lettuce salad, or this
no-mayo Cabbage Salad.

Ingredients
▢1.5 tbsp oil (vegetable, canola)
▢2 garlic cloves , minced
▢2 tsp ginger , grated
▢1/2 onion , finely chopped
▢500g / 1lb chicken thighs, sliced (Note 1)
▢2.5 tbsp curry powder (Note 2)
▢270 ml / 1.25 cups coconut milk , full fat (9 oz) (Note 3)
▢1.5 cups (375 ml) chicken stock low sodium
▢1/2 tsp salt
▢3/4 cup frozen peas
▢1/4 cup coriander / cilantro leaves , chopped

Instructions
1 - Heat oil in a skillet over medium high heat. Cook garlic, ginger and onion for 3 minutes until onion
is translucent.
2 - Add chicken and cook until it changes from pink to white.
3 - Add curry powder and cook for 2 minutes.
4 - Add coconut milk and chicken stock. Stir, lower heat to medium and cook, simmering rapidly, for 10
minutes until sauce reduces and thickens.
5 - Add peas and salt. Cook for a further 2 minutes, then taste to see if it needs more salt. Garnish with
coriander.
6 - Serve over rice, noodles or mashed potato!`,
  },
  "10": {
    title: "Italian Tiramisu",
    excerpt: "Layers of delicate ladyfinger biscuits soaked in coffee and nestled between rich mascarpone cheese and\n" +
        "cocoa powder, this indulgent dessert is a symphony of flavors and textures that will leave you craving\n" +
        "for more. Treat yourself to a taste of la dolce vita with this irresistible Italian delight.",
    image: "/images/recipes/tiramisu.webp",
    content: `Ingredients:
250g mascarpone cheese
3 large eggs, separated
1/2 cup granulated sugar
1 teaspoon vanilla extract
200g ladyfinger biscuits
1 cup brewed espresso, cooled
2 tablespoons coffee liqueur (optional)
Cocoa powder, for dusting

Preparation: In a mixing bowl, whisk together the egg yolks and sugar until pale and creamy. Add the
mascarpone cheese and vanilla extract, and mix until smooth and well combined. In a separate bowl,
beat the egg whites until stiff peaks form. Gently fold the beaten egg whites into the mascarpone
mixture until just combined.

Cooking Instructions: In a shallow dish, combine the brewed espresso and coffee liqueur (if using).
Dip each ladyfinger biscuit into the espresso mixture, ensuring it is soaked but not soggy. Arrange a
layer of soaked ladyfinger biscuits in the bottom of a serving dish or individual glasses. Spread half
of the mascarpone mixture evenly over the biscuits. Repeat the layers with the remaining soaked
ladyfingers and mascarpone mixture.

Cooking Instructions (continued): Smooth the top layer of mascarpone mixture with a spatula, ensuring
it is even. Cover the tiramisu with plastic wrap and refrigerate for at least 4 hours or overnight to
allow the flavors to meld together and the dessert to set.

Presentation: Before serving, dust the top of the tiramisu with cocoa powder using a fine mesh sieve.
This will add a touch of elegance and depth of flavor to the dessert. Slice into portions and serve
chilled, garnished with chocolate shavings or fresh berries if desired.

Conclusion: Indulge in the heavenly flavors of Italy with this classic Tiramisu recipe. With its layers
of espresso-soaked ladyfinger biscuits and creamy mascarpone cheese, each bite is a decadent delight
that will transport you to the streets of Rome. Whether enjoyed as a dessert for a special occasion or
a sweet treat to brighten your day, this Tiramisu is sure to leave a lasting impression.`,
  },
};

export default function RecipeDetailPage() {
  const params = useParams();
  const { token, isLoading } = useAuth();
  const id = params?.id as string;
  const recipe = id ? MOCK[id] : undefined;

  useEffect(() => {
    if (!isLoading && !token) {
      window.location.href = "/";
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
        <Link href="/recipes" className="font-medium text-amber-800 hover:underline">← Back to recipes</Link>
        <p className="mt-4 text-gray-800">Recipe not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <AppHeader />

      <main className="mx-auto max-w-2xl px-3 py-6 sm:px-4 sm:py-12">
        <Link href="/recipes" className="mb-4 inline-block text-sm font-medium text-amber-800 hover:underline sm:mb-6 sm:text-base">← Back to recipes</Link>

        <div className="overflow-hidden rounded-xl border border-amber-200/80 bg-white shadow-sm">
          <div className="aspect-[16/9] w-full overflow-hidden bg-amber-100">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
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
