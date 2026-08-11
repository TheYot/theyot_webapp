export type MenuTab = {
  id: string;
  label: string;
};

export type FoodCategory = {
  id: string;
  label: string;
  image: string;
};

export type Meal = {
  id: string;
  name: string;
  description: string;
  details: string;
  priceRwf: number;
  rating: number;
  image: string;
  categories: string[];
  tabs: string[];
};

export const MENU_TABS: MenuTab[] = [
  { id: "all", label: "all" },
  { id: "main", label: "Main" },
  { id: "drinks", label: "Drinks" },
  { id: "grilled", label: "Grilled" },
  { id: "cold", label: "Cold" },
  { id: "hot", label: "Hot" },
];

export const FOOD_CATEGORIES: FoodCategory[] = [
  {
    id: "breakfast",
    label: "BreakFast",
    image:
      "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "coffee",
    label: "Coffee",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "pizza",
    label: "Pizza",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "fast-food",
    label: "Fast Food",
    image:
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=400&q=80",
  },
];

export const PROMO = {
  title: "Up to 20% off order now",
  cta: "Order",
  image:
    "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=1200&q=80",
};

export const MEALS: Meal[] = [
  {
    id: "beef-burger",
    name: "Beef Burger",
    description: "Wagyu beef with special...",
    details:
      "Juicy wagyu beef patty, melted cheddar, crisp lettuce, tomato, and our house special sauce on a toasted brioche bun. Served with golden fries.",
    priceRwf: 12000,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    categories: ["fast-food"],
    tabs: ["all", "main", "grilled", "hot"],
  },
  {
    id: "classic-pizza",
    name: "Classic Pizza",
    description: "Wood-fired with mozzarella...",
    details:
      "Wood-fired pizza with San Marzano tomato sauce, fresh mozzarella, basil, and a drizzle of olive oil. Crisp edges, soft center.",
    priceRwf: 15000,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    categories: ["pizza"],
    tabs: ["all", "main", "hot"],
  },
  {
    id: "yot-latte",
    name: "YOT Latte",
    description: "Silky espresso with steamed...",
    details:
      "Double espresso pulled fresh, finished with silky steamed milk and a soft microfoam layer. Smooth, balanced, and aromatic.",
    priceRwf: 4500,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
    categories: ["coffee"],
    tabs: ["all", "drinks", "hot"],
  },
  {
    id: "sunrise-plate",
    name: "Sunrise Plate",
    description: "Eggs, toast, avocado &...",
    details:
      "Farm eggs your way, toasted sourdough, smashed avocado, cherry tomatoes, and a light herb oil. A bright start to your day.",
    priceRwf: 9000,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80",
    categories: ["breakfast"],
    tabs: ["all", "main", "hot"],
  },
  {
    id: "grilled-chicken",
    name: "Grilled Chicken",
    description: "Herb-marinated with citrus...",
    details:
      "Herb-marinated chicken grilled over open flame, finished with citrus glaze and served with seasonal greens and roasted potatoes.",
    priceRwf: 14000,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
    categories: ["fast-food"],
    tabs: ["all", "main", "grilled", "hot"],
  },
  {
    id: "iced-tea",
    name: "Iced House Tea",
    description: "Chilled citrus brew with...",
    details:
      "House-brewed black tea chilled over ice with fresh citrus and a hint of mint. Light, refreshing, and perfect with any meal.",
    priceRwf: 3500,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80",
    categories: ["coffee"],
    tabs: ["all", "drinks", "cold"],
  },
];

export function formatRwf(amount: number): string {
  return `${amount.toLocaleString("en-US")} RWF`;
}

export function getMealById(id: string): Meal | undefined {
  return MEALS.find((meal) => meal.id === id);
}

export function getSimilarMeals(meal: Meal, limit = 4): Meal[] {
  return MEALS.filter(
    (item) =>
      item.id !== meal.id &&
      (item.categories.some((category) => meal.categories.includes(category)) ||
        item.tabs.some((tab) => meal.tabs.includes(tab) && tab !== "all")),
  ).slice(0, limit);
}
