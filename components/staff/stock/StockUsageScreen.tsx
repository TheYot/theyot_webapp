"use client";

import { useMemo, useState, type FormEvent } from "react";
import { StaffShell } from "@/components/staff/StaffShell";
import {
  EmptyState,
  Feedback,
  Field,
  FormPanel,
  StatCard,
  TextInput,
  TextSelect,
} from "@/components/staff/stock/StockForm";
import { useStock } from "@/components/staff/stock/StockProvider";
import { formatQty, getStockStatus } from "@/lib/stock-data";

export function StockUsageScreen() {
  const { inventory, usage, getConsumedByItem, logWaste, ready } = useStock();
  const [inventoryId, setInventoryId] = useState(inventory[0]?.id ?? "");
  const [quantity, setQuantity] = useState("0.5");
  const [note, setNote] = useState("Kitchen waste");
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(
    null,
  );

  const rows = useMemo(
    () =>
      inventory.map((item) => {
        const consumed = getConsumedByItem(item.id);
        const remaining = item.onHand;
        const totalKnown = remaining + consumed;
        const consumedPct =
          totalKnown > 0 ? Math.round((consumed / totalKnown) * 100) : 0;
        return {
          item,
          consumed,
          remaining,
          consumedPct,
          status: getStockStatus(item),
        };
      }),
    [inventory, getConsumedByItem],
  );

  const totals = useMemo(() => {
    const low = rows.filter(
      (row) =>
        row.status === "low" ||
        row.status === "critical" ||
        row.status === "out",
    ).length;
    return {
      skus: rows.length,
      events: usage.length,
      low,
    };
  }, [rows, usage.length]);

  const onWaste = (event: FormEvent) => {
    event.preventDefault();
    const qty = Number(quantity);
    const error = logWaste(inventoryId, qty, note.trim() || "Waste logged");
    if (error) {
      setMessage({ tone: "error", text: error });
      return;
    }
    setMessage({ tone: "ok", text: "Waste deducted from remaining stock." });
  };

  return (
    <StaffShell
      title="Usage"
      subtitle="Remaining vs consumed — auto-calculated from sales, waste, and stock."
    >
      {!ready ? (
        <p className="text-sm text-main/45">Loading usage…</p>
      ) : (
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard label="Tracked items" value={totals.skus} />
            <StatCard label="Usage events" value={totals.events} />
            <StatCard
              label="Need reorder"
              value={totals.low}
              tone={totals.low ? "warn" : "good"}
            />
          </div>

          <FormPanel
            title="Log waste / spoilage"
            description="Removes quantity from remaining stock and records it as consumed."
            footer={
              <button
                type="submit"
                form="waste-form"
                className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full border border-main bg-main px-6 text-sm font-semibold text-white"
              >
                Deduct waste
              </button>
            }
          >
            <form id="waste-form" onSubmit={onWaste} className="space-y-4">
              {message ? <Feedback tone={message.tone} message={message.text} /> : null}
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Inventory item">
                  <TextSelect
                    value={inventoryId}
                    onChange={(e) => setInventoryId(e.target.value)}
                  >
                    {inventory.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.unit})
                      </option>
                    ))}
                  </TextSelect>
                </Field>
                <Field label="Quantity used">
                  <TextInput
                    type="number"
                    min={0}
                    step="any"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </Field>
                <Field label="Note">
                  <TextInput
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Prep trim / spoilage"
                  />
                </Field>
              </div>
            </form>
          </FormPanel>

          <section className="overflow-hidden rounded-2xl border border-main/10 bg-white">
            <div className="border-b border-main/10 px-4 py-3 sm:px-5">
              <h2 className="text-lg font-bold tracking-tight">Stock balance</h2>
              <p className="mt-1 text-sm text-main/50">
                Remaining is live on-hand. Consumed totals everything logged in usage.
              </p>
            </div>
            {rows.length === 0 ? (
              <div className="p-4">
                <EmptyState message="No inventory to show." />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-background text-main/55">
                    <tr>
                      <th className="px-4 py-3 font-semibold sm:px-5">Item</th>
                      <th className="px-4 py-3 font-semibold">Remaining</th>
                      <th className="px-4 py-3 font-semibold">Consumed</th>
                      <th className="px-4 py-3 font-semibold">Used %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(({ item, remaining, consumed, consumedPct }) => (
                      <tr key={item.id} className="border-t border-main/10">
                        <td className="px-4 py-3 sm:px-5">
                          <p className="font-semibold text-main">{item.name}</p>
                          <p className="text-xs capitalize text-main/45">
                            {item.category}
                          </p>
                        </td>
                        <td className="px-4 py-3 font-medium">
                          {formatQty(remaining, item.unit)}
                        </td>
                        <td className="px-4 py-3 text-main/70">
                          {formatQty(consumed, item.unit)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex min-w-[7rem] items-center gap-2">
                            <div className="h-2 flex-1 overflow-hidden rounded-full border border-main/10 bg-background">
                              <div
                                className="h-full rounded-full bg-accent"
                                style={{ width: `${consumedPct}%` }}
                              />
                            </div>
                            <span className="w-10 text-xs text-main/50">
                              {consumedPct}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-main/10 bg-white p-4 sm:p-5">
            <h2 className="text-lg font-bold tracking-tight">Usage timeline</h2>
            <p className="mt-1 text-sm text-main/50">
              Every sale, waste entry, and bottle exchange.
            </p>
            {usage.length === 0 ? (
              <div className="mt-4">
                <EmptyState message="No usage events yet." />
              </div>
            ) : (
              <ul className="mt-4 space-y-2">
                {usage.map((event) => (
                  <li
                    key={event.id}
                    className="rounded-xl border border-main/10 px-3 py-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold">{event.label}</p>
                      <span className="rounded-full border border-main/10 bg-background px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-main/55">
                        {event.type.replace("_", " ")}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-main/45">
                      {new Date(event.createdAt).toLocaleString()}
                    </p>
                    {event.deductions.some((d) => d.quantity > 0) ? (
                      <p className="mt-2 text-sm text-main/65">
                        {event.deductions
                          .filter((d) => d.quantity > 0)
                          .map((d) => `${d.name} ${formatQty(d.quantity, d.unit)}`)
                          .join(" · ")}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </StaffShell>
  );
}
