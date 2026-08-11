"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ChevronLeft, Minus, Plus } from "lucide-react";
import { AppNav } from "@/components/layout/AppNav";
import { MealCard } from "@/components/menu/MealCard";
import { OrderSuccessModal } from "@/components/order/OrderSuccessModal";
import { Button } from "@/components/ui/Button";
import { formatRwf, getSimilarMeals, type Meal } from "@/lib/menu-data";

type ProductDetailScreenProps = {
  meal: Meal;
  tableId?: string;
};

export function ProductDetailScreen({
  meal,
  tableId,
}: ProductDetailScreenProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [successOpen, setSuccessOpen] = useState(false);
  const similar = useMemo(() => getSimilarMeals(meal, 4), [meal]);
  const backHref = tableId
    ? `/menu?table=${encodeURIComponent(tableId)}`
    : "/menu";

  const decrease = () => setQuantity((value) => Math.max(1, value - 1));
  const increase = () => setQuantity((value) => Math.min(20, value + 1));

  const placeOrder = () => setSuccessOpen(true);

  const goToTracking = () => {
    const params = new URLSearchParams({ qty: String(quantity) });
    if (tableId) params.set("table", tableId);
    setSuccessOpen(false);
    router.push(`/orders/${meal.id}?${params.toString()}`);
  };

  return (
    <div className="min-h-dvh bg-background text-main">
      <AppNav active="explore" />

      <main className="mx-auto w-full max-w-7xl pb-28 lg:pt-28 lg:pb-12">
        <div className="lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-10 lg:px-8 xl:px-10">
          <section className="relative aspect-4/3 w-full overflow-hidden bg-main/10 sm:aspect-16/10 lg:aspect-auto lg:min-h-112 lg:rounded-[1.75rem] lg:border lg:border-main/10">
            <Image
              src={meal.image}
              alt={meal.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
            <Link
              href={backHref}
              aria-label="Back to menu"
              className="absolute top-4 left-4 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-main/10 bg-white text-main transition hover:bg-background lg:top-5 lg:left-5"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2.2} />
            </Link>
          </section>

          <section className="px-4 pt-5 sm:px-6 lg:px-0 lg:pt-2">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {meal.name}
              </h1>
              <p className="shrink-0 pt-1 text-base font-bold sm:text-lg">
                {formatRwf(meal.priceRwf)}
              </p>
            </div>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-main/55 sm:text-base">
              {meal.details}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="inline-flex h-11 items-center gap-4 rounded-full border border-main/15 bg-white px-4">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={decrease}
                  className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-main transition hover:bg-main/5"
                >
                  <Minus className="h-4 w-4" strokeWidth={2.2} />
                </button>
                <span className="min-w-4 text-center text-base font-semibold">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={increase}
                  className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-main transition hover:bg-main/5"
                >
                  <Plus className="h-4 w-4" strokeWidth={2.2} />
                </button>
              </div>

              <Button
                type="button"
                variant="accent"
                className="max-w-none flex-1 sm:max-w-[16rem]"
                onClick={placeOrder}
              >
                Make an Order
              </Button>
            </div>

            {tableId ? (
              <p className="mt-3 text-xs text-main/45 sm:text-sm">
                Ordering for table {tableId}
              </p>
            ) : null}
          </section>
        </div>

        {similar.length > 0 ? (
          <section className="mt-10 px-4 sm:px-6 lg:mt-14 lg:px-8 xl:px-10">
            <h2 className="text-base font-semibold text-main/45 sm:text-lg">
              Similar Meals
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
              {similar.map((item) => (
                <MealCard key={item.id} meal={item} tableId={tableId} />
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <OrderSuccessModal
        open={successOpen}
        mealName={meal.name}
        quantity={quantity}
        onContinue={goToTracking}
      />
    </div>
  );
}
