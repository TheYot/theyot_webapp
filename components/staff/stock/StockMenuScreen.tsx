"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
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
import { formatQty } from "@/lib/stock-data";

type DraftLine = {
  key: string;
  inventoryId: string;
  quantity: string;
};

export function StockMenuScreen() {
  const { inventory, recipes, addRecipe, logRecipeSale, ready } = useStock();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Main");
  const [lines, setLines] = useState<DraftLine[]>([
    { key: "1", inventoryId: inventory[0]?.id ?? "", quantity: "0.1" },
  ]);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(
    null,
  );
  const [saleMessage, setSaleMessage] = useState<{
    tone: "ok" | "error";
    text: string;
  } | null>(null);

  const inventoryOptions = useMemo(
    () => inventory.map((item) => ({ id: item.id, label: `${item.name} (${item.unit})` })),
    [inventory],
  );

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setMessage({ tone: "error", text: "Enter a menu item name." });
      return;
    }
    const parsed = lines
      .map((line) => ({
        inventoryId: line.inventoryId,
        quantity: Number(line.quantity),
      }))
      .filter((line) => line.inventoryId && Number.isFinite(line.quantity) && line.quantity > 0);

    if (parsed.length === 0) {
      setMessage({
        tone: "error",
        text: "Add at least one ingredient with a quantity.",
      });
      return;
    }

    addRecipe({ name, category, lines: parsed });
    setMessage({ tone: "ok", text: `${name.trim()} recipe saved.` });
    setName("");
    setLines([{ key: String(Date.now()), inventoryId: inventory[0]?.id ?? "", quantity: "0.1" }]);
  };

  const sellOne = (recipeId: string, recipeName: string) => {
    const error = logRecipeSale(recipeId, 1);
    if (error) {
      setSaleMessage({ tone: "error", text: error });
      return;
    }
    setSaleMessage({
      tone: "ok",
      text: `Logged 1× ${recipeName}. Stock deducted from ingredients.`,
    });
  };

  return (
    <StaffShell
      title="Menu items"
      subtitle="Define how much stock each plate or drink uses per serving."
    >
      {!ready ? (
        <p className="text-sm text-main/45">Loading recipes…</p>
      ) : (
        <div className="space-y-5">
          {saleMessage ? (
            <Feedback tone={saleMessage.tone} message={saleMessage.text} />
          ) : null}

          <FormPanel
            title="Add menu recipe"
            description="Example: Beef Burger → 0.05 kg tomatoes, 0.08 kg flour, 0.18 kg patty mix."
            footer={
              <button
                type="submit"
                form="add-recipe-form"
                className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full border border-main bg-main px-6 text-sm font-semibold text-white"
              >
                Save menu item
              </button>
            }
          >
            <form id="add-recipe-form" onSubmit={onSubmit} className="space-y-4">
              {message ? <Feedback tone={message.tone} message={message.text} /> : null}
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Menu name">
                  <TextInput
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Beef Burger"
                    required
                  />
                </Field>
                <Field label="Category">
                  <TextInput
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Main"
                  />
                </Field>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-main">Ingredients per serving</p>
                  <button
                    type="button"
                    onClick={() =>
                      setLines((prev) => [
                        ...prev,
                        {
                          key: String(Date.now()),
                          inventoryId: inventory[0]?.id ?? "",
                          quantity: "0.1",
                        },
                      ])
                    }
                    className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-main/15 px-3 text-sm font-semibold hover:bg-main/5"
                  >
                    <Plus className="h-4 w-4" />
                    Line
                  </button>
                </div>

                {lines.map((line, index) => (
                  <div
                    key={line.key}
                    className="grid gap-3 rounded-xl border border-main/10 bg-background/60 p-3 sm:grid-cols-[1fr_8rem_auto]"
                  >
                    <Field label={index === 0 ? "From inventory" : "Ingredient"}>
                      <TextSelect
                        value={line.inventoryId}
                        onChange={(e) =>
                          setLines((prev) =>
                            prev.map((row) =>
                              row.key === line.key
                                ? { ...row, inventoryId: e.target.value }
                                : row,
                            ),
                          )
                        }
                      >
                        <option value="">Select stock item</option>
                        {inventoryOptions.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label}
                          </option>
                        ))}
                      </TextSelect>
                    </Field>
                    <Field label="Qty / serving">
                      <TextInput
                        type="number"
                        min={0}
                        step="any"
                        value={line.quantity}
                        onChange={(e) =>
                          setLines((prev) =>
                            prev.map((row) =>
                              row.key === line.key
                                ? { ...row, quantity: e.target.value }
                                : row,
                            ),
                          )
                        }
                      />
                    </Field>
                    <div className="flex items-end">
                      <button
                        type="button"
                        disabled={lines.length <= 1}
                        onClick={() =>
                          setLines((prev) => prev.filter((row) => row.key !== line.key))
                        }
                        className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-main/15 text-main disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Remove ingredient"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </form>
          </FormPanel>

          {recipes.length === 0 ? (
            <EmptyState message="No menu recipes yet. Add one above." />
          ) : (
            <div className="grid gap-3 lg:grid-cols-2">
              {recipes.map((recipe) => (
                <article
                  key={recipe.id}
                  className="rounded-2xl border border-main/10 bg-white p-4 sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-main">{recipe.name}</h3>
                      <p className="mt-0.5 text-sm text-main/45">
                        {recipe.category} · {recipe.servingsLogged} servings logged
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => sellOne(recipe.id, recipe.name)}
                      className="inline-flex h-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-accent bg-accent px-4 text-sm font-semibold text-white"
                    >
                      Log sale
                    </button>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {recipe.lines.map((line) => {
                      const item = inventory.find((row) => row.id === line.inventoryId);
                      return (
                        <li
                          key={`${recipe.id}-${line.inventoryId}`}
                          className="flex items-center justify-between gap-3 rounded-xl border border-main/10 px-3 py-2 text-sm"
                        >
                          <span className="truncate font-medium">
                            {item?.name ?? "Missing item"}
                          </span>
                          <span className="shrink-0 text-main/55">
                            {item
                              ? formatQty(line.quantity, item.unit)
                              : line.quantity}
                            <span className="text-main/35"> / serving</span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </StaffShell>
  );
}
