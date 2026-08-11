"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  SEED_BOTTLES,
  SEED_INVENTORY,
  SEED_RECIPES,
  SEED_USAGE,
  createId,
  type BottleSerial,
  type InventoryItem,
  type MenuRecipe,
  type RecipeLine,
  type StockUnit,
  type UsageEvent,
} from "@/lib/stock-data";

const STORAGE_KEY = "yot-stock-mvp-v1";

type StockState = {
  inventory: InventoryItem[];
  recipes: MenuRecipe[];
  bottles: BottleSerial[];
  usage: UsageEvent[];
};

type StockContextValue = StockState & {
  ready: boolean;
  addInventory: (input: {
    name: string;
    category: InventoryItem["category"];
    unit: StockUnit;
    onHand: number;
    reorderAt: number;
    isLiquor?: boolean;
  }) => void;
  adjustInventory: (id: string, delta: number) => void;
  addRecipe: (input: {
    name: string;
    category: string;
    lines: RecipeLine[];
  }) => void;
  logRecipeSale: (recipeId: string, servings?: number) => string | null;
  logWaste: (inventoryId: string, quantity: number, note?: string) => string | null;
  scanBottleIn: (tagCode: string, inventoryId: string) => string | null;
  scanBottleOut: (tagCode: string) => string | null;
  getConsumedByItem: (inventoryId: string) => number;
  getItem: (id: string) => InventoryItem | undefined;
};

const StockContext = createContext<StockContextValue | null>(null);

const defaultState = (): StockState => ({
  inventory: SEED_INVENTORY,
  recipes: SEED_RECIPES,
  bottles: SEED_BOTTLES,
  usage: SEED_USAGE,
});

export function StockProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StockState>(defaultState);
  const [ready, setReady] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw) as StockState);
    } catch {
      // keep seed
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [ready, state]);

  const getItem = useCallback(
    (id: string) => state.inventory.find((item) => item.id === id),
    [state.inventory],
  );

  const getConsumedByItem = useCallback(
    (inventoryId: string) =>
      state.usage.reduce((sum, event) => {
        const match = event.deductions.find((d) => d.inventoryId === inventoryId);
        return sum + (match?.quantity ?? 0);
      }, 0),
    [state.usage],
  );

  const addInventory: StockContextValue["addInventory"] = useCallback((input) => {
    setState((prev) => ({
      ...prev,
      inventory: [
        {
          id: createId("inv"),
          name: input.name.trim(),
          category: input.category,
          unit: input.unit,
          onHand: input.onHand,
          reorderAt: input.reorderAt,
          isLiquor: Boolean(input.isLiquor),
          createdAt: new Date().toISOString(),
        },
        ...prev.inventory,
      ],
    }));
  }, []);

  const adjustInventory = useCallback((id: string, delta: number) => {
    setState((prev) => ({
      ...prev,
      inventory: prev.inventory.map((item) =>
        item.id === id
          ? { ...item, onHand: Math.max(0, Number((item.onHand + delta).toFixed(3))) }
          : item,
      ),
    }));
  }, []);

  const addRecipe: StockContextValue["addRecipe"] = useCallback((input) => {
    setState((prev) => ({
      ...prev,
      recipes: [
        {
          id: createId("recipe"),
          name: input.name.trim(),
          category: input.category.trim() || "General",
          servingsLogged: 0,
          lines: input.lines,
          createdAt: new Date().toISOString(),
        },
        ...prev.recipes,
      ],
    }));
  }, []);

  const logRecipeSale = useCallback((recipeId: string, servings = 1): string | null => {
    const prev = stateRef.current;
    const recipe = prev.recipes.find((item) => item.id === recipeId);
    if (!recipe) return "Menu item not found.";

    for (const line of recipe.lines) {
      const item = prev.inventory.find((row) => row.id === line.inventoryId);
      if (!item) return "A recipe ingredient is missing from inventory.";
      if (item.onHand < line.quantity * servings) {
        return `Not enough ${item.name} in stock.`;
      }
    }

    const deductions = recipe.lines.map((line) => {
      const item = prev.inventory.find((row) => row.id === line.inventoryId)!;
      return {
        inventoryId: item.id,
        name: item.name,
        quantity: Number((line.quantity * servings).toFixed(3)),
        unit: item.unit,
      };
    });

    setState((current) => ({
      ...current,
      inventory: current.inventory.map((item) => {
        const hit = deductions.find((d) => d.inventoryId === item.id);
        if (!hit) return item;
        return {
          ...item,
          onHand: Math.max(0, Number((item.onHand - hit.quantity).toFixed(3))),
        };
      }),
      recipes: current.recipes.map((item) =>
        item.id === recipeId
          ? { ...item, servingsLogged: item.servingsLogged + servings }
          : item,
      ),
      usage: [
        {
          id: createId("use"),
          type: "sale",
          label: `Sold ${servings}× ${recipe.name}`,
          createdAt: new Date().toISOString(),
          deductions,
        },
        ...current.usage,
      ],
    }));

    return null;
  }, []);

  const logWaste = useCallback(
    (inventoryId: string, quantity: number, note = "Waste logged"): string | null => {
      const item = stateRef.current.inventory.find((row) => row.id === inventoryId);
      if (!item) return "Inventory item not found.";
      if (quantity <= 0) return "Enter a valid quantity.";
      if (item.onHand < quantity) return `Not enough ${item.name} to log waste.`;

      setState((prev) => ({
        ...prev,
        inventory: prev.inventory.map((row) =>
          row.id === inventoryId
            ? {
                ...row,
                onHand: Math.max(0, Number((row.onHand - quantity).toFixed(3))),
              }
            : row,
        ),
        usage: [
          {
            id: createId("use"),
            type: "waste",
            label: note,
            createdAt: new Date().toISOString(),
            deductions: [
              {
                inventoryId: item.id,
                name: item.name,
                quantity,
                unit: item.unit,
              },
            ],
          },
          ...prev.usage,
        ],
      }));

      return null;
    },
    [],
  );

  const scanBottleIn = useCallback((tagCode: string, inventoryId: string): string | null => {
    const code = tagCode.trim().toUpperCase();
    if (!code) return "Enter or scan a bottle tag.";

    const prev = stateRef.current;
    if (prev.bottles.some((b) => b.tagCode === code)) {
      return "This tag is already registered.";
    }
    const item = prev.inventory.find((row) => row.id === inventoryId);
    if (!item || !item.isLiquor) return "Select a liquor inventory item.";

    const bottleVolume = item.unit === "ml" ? 750 : 1;

    setState((current) => ({
      ...current,
      bottles: [
        {
          id: createId("bot"),
          tagCode: code,
          inventoryId: item.id,
          productName: item.name,
          status: "active",
          scannedInAt: new Date().toISOString(),
        },
        ...current.bottles,
      ],
      inventory: current.inventory.map((row) =>
        row.id === item.id
          ? {
              ...row,
              onHand: Number((row.onHand + bottleVolume).toFixed(3)),
            }
          : row,
      ),
    }));

    return null;
  }, []);

  const scanBottleOut = useCallback((tagCode: string): string | null => {
    const code = tagCode.trim().toUpperCase();
    const bottle = stateRef.current.bottles.find((b) => b.tagCode === code);
    if (!bottle) return "Tag not found in active inventory.";
    if (bottle.status === "destroyed") {
      return "This bottle was already marked destroyed.";
    }

    setState((prev) => ({
      ...prev,
      bottles: prev.bottles.map((b) =>
        b.tagCode === code
          ? {
              ...b,
              status: "destroyed",
              destroyedAt: new Date().toISOString(),
            }
          : b,
      ),
      usage: [
        {
          id: createId("use"),
          type: "bottle_destroy",
          label: `Empty bottle exchanged · ${bottle.tagCode}`,
          createdAt: new Date().toISOString(),
          deductions: [
            {
              inventoryId: bottle.inventoryId,
              name: bottle.productName,
              quantity: 0,
              unit: "bottles",
            },
          ],
        },
        ...prev.usage,
      ],
    }));

    return null;
  }, []);

  const value = useMemo<StockContextValue>(
    () => ({
      ...state,
      ready,
      addInventory,
      adjustInventory,
      addRecipe,
      logRecipeSale,
      logWaste,
      scanBottleIn,
      scanBottleOut,
      getConsumedByItem,
      getItem,
    }),
    [
      state,
      ready,
      addInventory,
      adjustInventory,
      addRecipe,
      logRecipeSale,
      logWaste,
      scanBottleIn,
      scanBottleOut,
      getConsumedByItem,
      getItem,
    ],
  );

  return <StockContext.Provider value={value}>{children}</StockContext.Provider>;
}

export function useStock() {
  const ctx = useContext(StockContext);
  if (!ctx) throw new Error("useStock must be used within StockProvider");
  return ctx;
}
