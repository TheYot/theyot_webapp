"use client";

import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  ClipboardList,
  TriangleAlert,
  UtensilsCrossed,
  Wine,
} from "lucide-react";
import { StaffShell } from "@/components/staff/StaffShell";
import { StatCard } from "@/components/staff/stock/StockForm";
import { useStock } from "@/components/staff/stock/StockProvider";
import {
  STOCK_STATUS_META,
  formatQty,
  getStockStatus,
} from "@/lib/stock-data";

const QUICK_LINKS = [
  {
    href: "/staff/stock/inventory",
    label: "Add stock",
    description: "Record flour, produce, spirits, and more.",
    icon: Boxes,
  },
  {
    href: "/staff/stock/menu",
    label: "Menu recipes",
    description: "Map each plate to ingredient quantities.",
    icon: UtensilsCrossed,
  },
  {
    href: "/staff/stock/usage",
    label: "Usage view",
    description: "See remaining vs consumed automatically.",
    icon: ClipboardList,
  },
  {
    href: "/staff/stock/liquor",
    label: "Liquor tags",
    description: "Scan bottles in, then empty for authenticity.",
    icon: Wine,
  },
] as const;

export function StockHomeScreen() {
  const { inventory, recipes, bottles, usage, ready } = useStock();

  const alerts = inventory.filter((item) => {
    const status = getStockStatus(item);
    return status === "low" || status === "critical" || status === "out";
  });
  const activeBottles = bottles.filter((b) => b.status === "active").length;
  const destroyedBottles = bottles.filter((b) => b.status === "destroyed").length;

  return (
    <StaffShell
      title="Stock home"
      subtitle="Overview of inventory health, recipes, usage, and liquor passports."
    >
      {!ready ? (
        <p className="text-sm text-main/45">Loading stock data…</p>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Inventory SKUs" value={inventory.length} />
            <StatCard
              label="Low / critical"
              value={alerts.length}
              tone={alerts.length ? "warn" : "good"}
              note="Below reorder threshold"
            />
            <StatCard label="Menu recipes" value={recipes.length} />
            <StatCard
              label="Active liquor tags"
              value={activeBottles}
              note={`${destroyedBottles} emptied & verified`}
            />
          </div>

          <section className="rounded-2xl border border-amber-300/50 bg-amber-50 px-4 py-3">
            <div className="flex items-start gap-3">
              <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
              <div>
                <p className="font-semibold text-amber-900">
                  {alerts.length
                    ? `${alerts.length} item${alerts.length === 1 ? "" : "s"} need attention`
                    : "All stock levels look healthy"}
                </p>
                <p className="mt-1 text-sm text-amber-800/80">
                  Usage deducts from on-hand when you log a sale or waste. Liquor
                  tags prove bottle originality on empty exchange.
                </p>
              </div>
            </div>
          </section>

          <div className="grid gap-3 sm:grid-cols-2">
            {QUICK_LINKS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-start gap-3 rounded-2xl border border-main/10 bg-white p-4 transition hover:border-accent/50 hover:bg-accent/5"
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-main/10 bg-background text-main">
                    <Icon className="h-5 w-5" strokeWidth={2.1} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-bold text-main">{item.label}</span>
                      <ArrowRight className="h-4 w-4 text-main/30 transition group-hover:translate-x-0.5 group-hover:text-accent" />
                    </span>
                    <span className="mt-1 block text-sm text-main/50">
                      {item.description}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-2xl border border-main/10 bg-white p-4 sm:p-5">
              <h2 className="text-lg font-bold tracking-tight">Attention list</h2>
              <p className="mt-1 text-sm text-main/50">
                Items at or below reorder point.
              </p>
              <ul className="mt-4 space-y-2">
                {alerts.length === 0 ? (
                  <li className="text-sm text-main/45">Nothing critical right now.</li>
                ) : (
                  alerts.slice(0, 6).map((item) => {
                    const status = getStockStatus(item);
                    const meta = STOCK_STATUS_META[status];
                    return (
                      <li
                        key={item.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-main/10 px-3 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{item.name}</p>
                          <p className="text-xs text-main/45">
                            {formatQty(item.onHand, item.unit)} on hand
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${meta.className}`}
                        >
                          {meta.label}
                        </span>
                      </li>
                    );
                  })
                )}
              </ul>
            </section>

            <section className="rounded-2xl border border-main/10 bg-white p-4 sm:p-5">
              <h2 className="text-lg font-bold tracking-tight">Recent usage</h2>
              <p className="mt-1 text-sm text-main/50">
                Latest sales, waste, and bottle exchanges.
              </p>
              <ul className="mt-4 space-y-2">
                {usage.slice(0, 6).map((event) => (
                  <li
                    key={event.id}
                    className="rounded-xl border border-main/10 px-3 py-2.5"
                  >
                    <p className="font-semibold">{event.label}</p>
                    <p className="mt-0.5 text-xs text-main/45">
                      {new Date(event.createdAt).toLocaleString()} ·{" "}
                      {event.deductions
                        .filter((d) => d.quantity > 0)
                        .map((d) => `${d.name} ${formatQty(d.quantity, d.unit)}`)
                        .join(", ") || "Passport verified"}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      )}
    </StaffShell>
  );
}
