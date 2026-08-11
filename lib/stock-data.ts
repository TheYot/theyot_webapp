export type StockCategory =
  | "all"
  | "spirits"
  | "mixers"
  | "garnish"
  | "beer"
  | "wine";

export type StockStatus = "healthy" | "low" | "critical" | "out";

export type StockItem = {
  id: string;
  name: string;
  category: Exclude<StockCategory, "all">;
  unit: "ml" | "g" | "bottles" | "pcs";
  onHand: number;
  reorderAt: number;
  capacity: number;
  image: string;
  lastUpdated: string;
  bottlesTagged?: number;
};

export const STOCK_CATEGORIES: Array<{ id: StockCategory; label: string }> = [
  { id: "all", label: "All" },
  { id: "spirits", label: "Spirits" },
  { id: "mixers", label: "Mixers" },
  { id: "garnish", label: "Garnish" },
  { id: "beer", label: "Beer" },
  { id: "wine", label: "Wine" },
];

export const STOCK_ITEMS: StockItem[] = [
  {
    id: "rum-white",
    name: "Premium White Rum",
    category: "spirits",
    unit: "ml",
    onHand: 4200,
    reorderAt: 1500,
    capacity: 7500,
    bottlesTagged: 6,
    lastUpdated: "2 min ago",
    image:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "vodka",
    name: "House Vodka",
    category: "spirits",
    unit: "ml",
    onHand: 980,
    reorderAt: 1500,
    capacity: 6000,
    bottlesTagged: 2,
    lastUpdated: "5 min ago",
    image:
      "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "whiskey",
    name: "Blended Whiskey",
    category: "spirits",
    unit: "ml",
    onHand: 2100,
    reorderAt: 1200,
    capacity: 4500,
    bottlesTagged: 4,
    lastUpdated: "12 min ago",
    image:
      "https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "lime-juice",
    name: "Fresh Lime Juice",
    category: "mixers",
    unit: "ml",
    onHand: 650,
    reorderAt: 800,
    capacity: 3000,
    lastUpdated: "8 min ago",
    image:
      "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "sugar-syrup",
    name: "Sugar Syrup",
    category: "mixers",
    unit: "ml",
    onHand: 1800,
    reorderAt: 700,
    capacity: 4000,
    lastUpdated: "20 min ago",
    image:
      "https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "mint",
    name: "Fresh Mint",
    category: "garnish",
    unit: "g",
    onHand: 120,
    reorderAt: 200,
    capacity: 800,
    lastUpdated: "1 hr ago",
    image:
      "https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "lager",
    name: "Local Lager",
    category: "beer",
    unit: "bottles",
    onHand: 86,
    reorderAt: 40,
    capacity: 200,
    lastUpdated: "30 min ago",
    image:
      "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "house-red",
    name: "House Red Wine",
    category: "wine",
    unit: "ml",
    onHand: 0,
    reorderAt: 1500,
    capacity: 6000,
    bottlesTagged: 0,
    lastUpdated: "3 hr ago",
    image:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80",
  },
];

export function getStockStatus(item: StockItem): StockStatus {
  if (item.onHand <= 0) return "out";
  if (item.onHand <= item.reorderAt * 0.5) return "critical";
  if (item.onHand <= item.reorderAt) return "low";
  return "healthy";
}

export function formatStockQty(item: StockItem): string {
  if (item.unit === "ml") {
    return item.onHand >= 1000
      ? `${(item.onHand / 1000).toFixed(1)} L`
      : `${item.onHand} ml`;
  }
  if (item.unit === "g") return `${item.onHand} g`;
  if (item.unit === "bottles") return `${item.onHand} bottles`;
  return `${item.onHand} pcs`;
}

export const STOCK_STATUS_META: Record<
  StockStatus,
  { label: string; className: string }
> = {
  healthy: {
    label: "Healthy",
    className: "bg-emerald-500 text-white border-emerald-600/20",
  },
  low: {
    label: "Low stock",
    className: "bg-amber-400 text-main border-amber-500/20",
  },
  critical: {
    label: "Critical",
    className: "bg-orange-500 text-white border-orange-600/20",
  },
  out: {
    label: "Out of stock",
    className: "bg-red-500 text-white border-red-600/20",
  },
};
