import { formatRwf, getMealById, type Meal } from "@/lib/menu-data";

export type BillLine = {
  meal: Meal;
  quantity: number;
  unitPriceRwf: number;
  lineTotalRwf: number;
};

export type BillSummary = {
  lines: BillLine[];
  subtotalRwf: number;
  vatRate: number;
  vatRwf: number;
  totalRwf: number;
};

export const VAT_RATE = 0.18;

export function buildBillSummary(
  items: Array<{ mealId: string; quantity: number }>,
): BillSummary | null {
  const lines: BillLine[] = [];

  for (const item of items) {
    const meal = getMealById(item.mealId);
    if (!meal) continue;
    const quantity = Math.min(20, Math.max(1, item.quantity || 1));
    lines.push({
      meal,
      quantity,
      unitPriceRwf: meal.priceRwf,
      lineTotalRwf: meal.priceRwf * quantity,
    });
  }

  if (lines.length === 0) return null;

  const subtotalRwf = lines.reduce((sum, line) => sum + line.lineTotalRwf, 0);
  const vatRwf = Math.round(subtotalRwf * VAT_RATE);
  const totalRwf = subtotalRwf + vatRwf;

  return {
    lines,
    subtotalRwf,
    vatRate: VAT_RATE,
    vatRwf,
    totalRwf,
  };
}

export function formatMoney(amount: number): string {
  return formatRwf(amount);
}

export function orderQuery(params: {
  mealId: string;
  quantity: number;
  tableId?: string;
}): string {
  const search = new URLSearchParams({
    meal: params.mealId,
    qty: String(params.quantity),
  });
  if (params.tableId) search.set("table", params.tableId);
  return search.toString();
}
