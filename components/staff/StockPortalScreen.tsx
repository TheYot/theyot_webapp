"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  PackagePlus,
  Plus,
  Search,
  TriangleAlert,
} from "lucide-react";
import { StaffShell } from "@/components/staff/StaffShell";
import { Button } from "@/components/ui/Button";
import {
  STOCK_CATEGORIES,
  STOCK_ITEMS,
  STOCK_STATUS_META,
  formatStockQty,
  getStockStatus,
  type StockCategory,
  type StockItem,
} from "@/lib/stock-data";

function StockCard({ item }: { item: StockItem }) {
  const status = getStockStatus(item);
  const meta = STOCK_STATUS_META[status];
  const fill = Math.min(100, Math.round((item.onHand / item.capacity) * 100));

  return (
    <article className="overflow-hidden rounded-[1.35rem] border border-main/10 bg-white">
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
        <span
          className={`absolute top-2.5 right-2.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${meta.className}`}
        >
          {meta.label}
        </span>
      </div>

      <div className="space-y-3 p-4">
        <div>
          <h3 className="font-bold text-main">{item.name}</h3>
          <p className="mt-0.5 text-sm capitalize text-main/45">{item.category}</p>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="font-semibold">{formatStockQty(item)}</span>
            <span className="text-main/45">Reorder ≤ {item.reorderAt}{item.unit === "ml" ? " ml" : item.unit === "g" ? " g" : ""}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full border border-main/10 bg-background">
            <div
              className={[
                "h-full rounded-full",
                status === "healthy"
                  ? "bg-emerald-500"
                  : status === "low"
                    ? "bg-amber-400"
                    : status === "critical"
                      ? "bg-orange-500"
                      : "bg-red-500",
              ].join(" ")}
              style={{ width: `${fill}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-main/45">
          <span>Updated {item.lastUpdated}</span>
          {typeof item.bottlesTagged === "number" ? (
            <span>{item.bottlesTagged} tagged bottles</span>
          ) : null}
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            className="inline-flex h-9 flex-1 cursor-pointer items-center justify-center rounded-full border border-main/15 text-sm font-semibold text-main transition hover:bg-main/5"
          >
            Log waste
          </button>
          <button
            type="button"
            className="inline-flex h-9 flex-1 cursor-pointer items-center justify-center rounded-full border border-accent bg-accent text-sm font-semibold text-white transition hover:brightness-105"
          >
            Reorder
          </button>
        </div>
      </div>
    </article>
  );
}

export function StockPortalScreen() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<StockCategory>("all");

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return STOCK_ITEMS.filter((item) => {
      const matchesCategory = category === "all" || item.category === category;
      const matchesQuery = q
        ? `${item.name} ${item.category}`.toLowerCase().includes(q)
        : true;
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  const alertCount = STOCK_ITEMS.filter((item) => {
    const status = getStockStatus(item);
    return status === "low" || status === "critical" || status === "out";
  }).length;

  return (
    <StaffShell
      title="Stock Management"
      subtitle="Live inventory, recipe deduction readiness, and bottle passport tracking."
    >
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-main/10 bg-white p-4">
          <p className="text-xs font-medium text-main/45">Tracked SKUs</p>
          <p className="mt-1 text-2xl font-bold">{STOCK_ITEMS.length}</p>
        </div>
        <div className="rounded-2xl border border-main/10 bg-white p-4">
          <p className="text-xs font-medium text-main/45">Alerts</p>
          <p className="mt-1 text-2xl font-bold text-orange-600">{alertCount}</p>
        </div>
        <div className="rounded-2xl border border-main/10 bg-white p-4">
          <p className="text-xs font-medium text-main/45">Tagged bottles</p>
          <p className="mt-1 text-2xl font-bold">
            {STOCK_ITEMS.reduce((sum, item) => sum + (item.bottlesTagged ?? 0), 0)}
          </p>
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-main/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search inventory item"
            className="h-11 w-full rounded-full border border-main/15 bg-white pr-4 pl-10 text-sm outline-none focus:border-accent"
          />
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" className="max-w-none gap-2 px-4">
            <PackagePlus className="h-4 w-4" />
            Intake bottle
          </Button>
          <Button type="button" variant="main" className="max-w-none gap-2 px-4">
            <Plus className="h-4 w-4" />
            Add item
          </Button>
        </div>
      </div>

      <div className="mb-5 -mx-1 overflow-x-auto px-1">
        <div className="flex min-w-max gap-2">
          {STOCK_CATEGORIES.map((item) => {
            const active = category === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.id)}
                className={[
                  "cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition",
                  active
                    ? "border-main bg-main text-white"
                    : "border-main/10 bg-white text-main hover:bg-main/5",
                ].join(" ")}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <section id="alerts" className="mb-5 rounded-2xl border border-amber-300/50 bg-amber-50 px-4 py-3">
        <div className="flex items-start gap-3">
          <TriangleAlert className="mt-0.5 h-5 w-5 text-amber-700" />
          <div>
            <p className="font-semibold text-amber-900">
              Auto-reorder alerts active
            </p>
            <p className="mt-1 text-sm text-amber-800/80">
              {alertCount} item{alertCount === 1 ? "" : "s"} below threshold.
              Recipe deduction will continue after payment confirmation in later
              phases.
            </p>
          </div>
        </div>
      </section>

      {items.length === 0 ? (
        <p className="text-sm text-main/50">No inventory matches your filters.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <StockCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </StaffShell>
  );
}
