"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Plus, Search } from "lucide-react";
import { StaffShell } from "@/components/staff/StaffShell";
import {
  EmptyState,
  Feedback,
  Field,
  FormPanel,
  TextInput,
  TextSelect,
} from "@/components/staff/stock/StockForm";
import { useStock } from "@/components/staff/stock/StockProvider";
import {
  STOCK_CATEGORIES,
  STOCK_STATUS_META,
  STOCK_UNITS,
  formatQty,
  getStockStatus,
  type StockCategory,
  type StockUnit,
} from "@/lib/stock-data";

export function StockInventoryScreen() {
  const { inventory, addInventory, adjustInventory, ready } = useStock();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<StockCategory>("all");
  const [name, setName] = useState("");
  const [itemCategory, setItemCategory] =
    useState<Exclude<StockCategory, "all">>("dry");
  const [unit, setUnit] = useState<StockUnit>("kg");
  const [onHand, setOnHand] = useState("50");
  const [reorderAt, setReorderAt] = useState("10");
  const [isLiquor, setIsLiquor] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(
    null,
  );
  const [showForm, setShowForm] = useState(true);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inventory.filter((item) => {
      const matchesCategory = category === "all" || item.category === category;
      const matchesQuery = q
        ? `${item.name} ${item.category}`.toLowerCase().includes(q)
        : true;
      return matchesCategory && matchesQuery;
    });
  }, [inventory, category, query]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const qty = Number(onHand);
    const reorder = Number(reorderAt);
    if (!name.trim()) {
      setMessage({ tone: "error", text: "Enter an item name." });
      return;
    }
    if (!Number.isFinite(qty) || qty < 0) {
      setMessage({ tone: "error", text: "Enter a valid stock quantity." });
      return;
    }
    if (!Number.isFinite(reorder) || reorder < 0) {
      setMessage({ tone: "error", text: "Enter a valid reorder point." });
      return;
    }

    addInventory({
      name,
      category: itemCategory,
      unit,
      onHand: qty,
      reorderAt: reorder,
      isLiquor: isLiquor || itemCategory === "spirits",
    });
    setMessage({ tone: "ok", text: `${name.trim()} added to inventory.` });
    setName("");
    setOnHand("0");
  };

  return (
    <StaffShell
      title="Inventory"
      subtitle="Add and track stock quantities — flour, produce, spirits, and more."
    >
      {!ready ? (
        <p className="text-sm text-main/45">Loading inventory…</p>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-main/40" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search stock"
                className="h-11 w-full rounded-full border border-main/15 bg-white pr-4 pl-10 text-sm outline-none focus:border-accent"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowForm((v) => !v)}
              className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-main bg-main px-5 text-sm font-semibold text-white"
            >
              <Plus className="h-4 w-4" />
              {showForm ? "Hide form" : "Add stock"}
            </button>
          </div>

          {showForm ? (
            <FormPanel
              title="Add stock intake"
              description="Example: 50 kg of flour, 12 kg tomatoes, or a new mixer SKU."
              footer={
                <button
                  type="submit"
                  form="add-stock-form"
                  className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full border border-main bg-main px-6 text-sm font-semibold text-white"
                >
                  Save to inventory
                </button>
              }
            >
              <form id="add-stock-form" onSubmit={onSubmit} className="space-y-4">
                {message ? (
                  <Feedback tone={message.tone} message={message.text} />
                ) : null}
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Item name">
                    <TextInput
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Wheat Flour"
                      required
                    />
                  </Field>
                  <Field label="Category">
                    <TextSelect
                      value={itemCategory}
                      onChange={(e) => {
                        const next = e.target.value as Exclude<StockCategory, "all">;
                        setItemCategory(next);
                        if (next === "spirits") setIsLiquor(true);
                      }}
                    >
                      {STOCK_CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </TextSelect>
                  </Field>
                  <Field label="Quantity on hand">
                    <TextInput
                      type="number"
                      min={0}
                      step="any"
                      value={onHand}
                      onChange={(e) => setOnHand(e.target.value)}
                      required
                    />
                  </Field>
                  <Field label="Unit">
                    <TextSelect
                      value={unit}
                      onChange={(e) => setUnit(e.target.value as StockUnit)}
                    >
                      {STOCK_UNITS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </TextSelect>
                  </Field>
                  <Field label="Reorder when at or below" hint="Triggers low-stock alerts on Home.">
                    <TextInput
                      type="number"
                      min={0}
                      step="any"
                      value={reorderAt}
                      onChange={(e) => setReorderAt(e.target.value)}
                      required
                    />
                  </Field>
                  <Field label="Liquor passport item?">
                    <label className="flex h-11 cursor-pointer items-center gap-3 rounded-xl border border-main/15 bg-white px-3.5 text-sm">
                      <input
                        type="checkbox"
                        checked={isLiquor}
                        onChange={(e) => setIsLiquor(e.target.checked)}
                        className="h-4 w-4 accent-[var(--main)]"
                      />
                      Track bottles with scan tags
                    </label>
                  </Field>
                </div>
              </form>
            </FormPanel>
          ) : null}

          <div className="-mx-1 overflow-x-auto px-1">
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

          {items.length === 0 ? (
            <EmptyState message="No inventory matches your filters." />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => {
                const status = getStockStatus(item);
                const meta = STOCK_STATUS_META[status];
                const fill = Math.min(
                  100,
                  Math.round((item.onHand / Math.max(item.reorderAt * 3, 1)) * 100),
                );
                return (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-main/10 bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="truncate font-bold text-main">{item.name}</h3>
                        <p className="mt-0.5 text-sm capitalize text-main/45">
                          {item.category}
                          {item.isLiquor ? " · liquor" : ""}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${meta.className}`}
                      >
                        {meta.label}
                      </span>
                    </div>

                    <div className="mt-4">
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="font-semibold">
                          {formatQty(item.onHand, item.unit)}
                        </span>
                        <span className="text-main/45">
                          Reorder ≤ {formatQty(item.reorderAt, item.unit)}
                        </span>
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

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => adjustInventory(item.id, item.unit === "kg" ? 1 : 100)}
                        className="inline-flex h-9 flex-1 cursor-pointer items-center justify-center rounded-full border border-main/15 text-sm font-semibold hover:bg-main/5"
                      >
                        Quick +
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          adjustInventory(item.id, item.unit === "kg" ? -1 : -100)
                        }
                        className="inline-flex h-9 flex-1 cursor-pointer items-center justify-center rounded-full border border-main/15 text-sm font-semibold hover:bg-main/5"
                      >
                        Quick −
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}
    </StaffShell>
  );
}
