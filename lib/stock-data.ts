export type StockUnit = "kg" | "g" | "ml" | "L" | "pcs" | "bottles";

export type StockCategory =
  | "all"
  | "dry"
  | "produce"
  | "spirits"
  | "mixers"
  | "garnish"
  | "beer"
  | "wine"
  | "other";

export type StockStatus = "healthy" | "low" | "critical" | "out";

export type InventoryItem = {
  id: string;
  name: string;
  category: Exclude<StockCategory, "all">;
  unit: StockUnit;
  onHand: number;
  reorderAt: number;
  isLiquor: boolean;
  createdAt: string;
};

export type RecipeLine = {
  inventoryId: string;
  quantity: number;
};

export type MenuRecipe = {
  id: string;
  name: string;
  category: string;
  servingsLogged: number;
  lines: RecipeLine[];
  createdAt: string;
};

export type BottleStatus = "active" | "destroyed";

export type BottleSerial = {
  id: string;
  tagCode: string;
  inventoryId: string;
  productName: string;
  status: BottleStatus;
  scannedInAt: string;
  destroyedAt?: string;
};

export type UsageEvent = {
  id: string;
  type: "sale" | "waste" | "bottle_destroy";
  label: string;
  createdAt: string;
  deductions: Array<{
    inventoryId: string;
    name: string;
    quantity: number;
    unit: StockUnit;
  }>;
};

export const STOCK_CATEGORIES: Array<{ id: StockCategory; label: string }> = [
  { id: "all", label: "All" },
  { id: "dry", label: "Dry goods" },
  { id: "produce", label: "Produce" },
  { id: "spirits", label: "Spirits" },
  { id: "mixers", label: "Mixers" },
  { id: "garnish", label: "Garnish" },
  { id: "beer", label: "Beer" },
  { id: "wine", label: "Wine" },
  { id: "other", label: "Other" },
];

export const STOCK_UNITS: StockUnit[] = ["kg", "g", "ml", "L", "pcs", "bottles"];

const now = () => new Date().toISOString();

export const SEED_INVENTORY: InventoryItem[] = [
  {
    id: "flour",
    name: "Wheat Flour",
    category: "dry",
    unit: "kg",
    onHand: 50,
    reorderAt: 10,
    isLiquor: false,
    createdAt: now(),
  },
  {
    id: "tomatoes",
    name: "Tomatoes",
    category: "produce",
    unit: "kg",
    onHand: 12,
    reorderAt: 4,
    isLiquor: false,
    createdAt: now(),
  },
  {
    id: "beef-patty",
    name: "Beef Patty Mix",
    category: "other",
    unit: "kg",
    onHand: 18,
    reorderAt: 5,
    isLiquor: false,
    createdAt: now(),
  },
  {
    id: "rum-white",
    name: "Premium White Rum",
    category: "spirits",
    unit: "ml",
    onHand: 4500,
    reorderAt: 1500,
    isLiquor: true,
    createdAt: now(),
  },
  {
    id: "lime-juice",
    name: "Lime Juice",
    category: "mixers",
    unit: "ml",
    onHand: 2200,
    reorderAt: 800,
    isLiquor: false,
    createdAt: now(),
  },
  {
    id: "sugar",
    name: "Sugar",
    category: "dry",
    unit: "kg",
    onHand: 8,
    reorderAt: 2,
    isLiquor: false,
    createdAt: now(),
  },
  {
    id: "mint",
    name: "Fresh Mint",
    category: "garnish",
    unit: "g",
    onHand: 350,
    reorderAt: 100,
    isLiquor: false,
    createdAt: now(),
  },
];

export const SEED_RECIPES: MenuRecipe[] = [
  {
    id: "burger",
    name: "Beef Burger",
    category: "Main",
    servingsLogged: 24,
    createdAt: now(),
    lines: [
      { inventoryId: "beef-patty", quantity: 0.18 },
      { inventoryId: "flour", quantity: 0.08 },
      { inventoryId: "tomatoes", quantity: 0.05 },
    ],
  },
  {
    id: "mojito",
    name: "Mojito",
    category: "Drinks",
    servingsLogged: 40,
    createdAt: now(),
    lines: [
      { inventoryId: "rum-white", quantity: 50 },
      { inventoryId: "lime-juice", quantity: 30 },
      { inventoryId: "sugar", quantity: 0.015 },
      { inventoryId: "mint", quantity: 8 },
    ],
  },
];

export const SEED_BOTTLES: BottleSerial[] = [
  {
    id: "b1",
    tagCode: "YOT-RUM-1001",
    inventoryId: "rum-white",
    productName: "Premium White Rum",
    status: "active",
    scannedInAt: now(),
  },
  {
    id: "b2",
    tagCode: "YOT-RUM-1002",
    inventoryId: "rum-white",
    productName: "Premium White Rum",
    status: "active",
    scannedInAt: now(),
  },
];

export const SEED_USAGE: UsageEvent[] = [
  {
    id: "u1",
    type: "sale",
    label: "Sold 1× Beef Burger",
    createdAt: now(),
    deductions: [
      { inventoryId: "beef-patty", name: "Beef Patty Mix", quantity: 0.18, unit: "kg" },
      { inventoryId: "flour", name: "Wheat Flour", quantity: 0.08, unit: "kg" },
      { inventoryId: "tomatoes", name: "Tomatoes", quantity: 0.05, unit: "kg" },
    ],
  },
];

export function getStockStatus(item: InventoryItem): StockStatus {
  if (item.onHand <= 0) return "out";
  if (item.onHand <= item.reorderAt * 0.5) return "critical";
  if (item.onHand <= item.reorderAt) return "low";
  return "healthy";
}

export function formatQty(quantity: number, unit: StockUnit): string {
  const rounded =
    unit === "kg" || unit === "L"
      ? Number(quantity.toFixed(3))
      : Number(quantity.toFixed(1));
  return `${rounded} ${unit}`;
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

export function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
