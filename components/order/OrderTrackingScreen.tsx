"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, Minus, Plus, ThumbsUp } from "lucide-react";
import { AppNav } from "@/components/layout/AppNav";
import { OrderTimeline } from "@/components/order/OrderTimeline";
import { Button } from "@/components/ui/Button";
import { formatRwf, type Meal } from "@/lib/menu-data";

type OrderTrackingScreenProps = {
  meal: Meal;
  initialQuantity?: number;
  tableId?: string;
};

export function OrderTrackingScreen({
  meal,
  initialQuantity = 1,
  tableId,
}: OrderTrackingScreenProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [liked, setLiked] = useState(false);
  const [notified, setNotified] = useState(false);

  const backHref = tableId
    ? `/menu/${meal.id}?table=${encodeURIComponent(tableId)}`
    : `/menu/${meal.id}`;

  return (
    <div className="min-h-dvh bg-background text-main">
      <AppNav active="orders" />

      <main className="mx-auto w-full max-w-7xl pb-28 lg:pt-28 lg:pb-12">
        <div className="lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-10 lg:px-8 xl:px-10">
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
              aria-label="Back"
              className="absolute top-4 left-4 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-main/10 bg-white text-main transition hover:bg-background"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2.2} />
            </Link>
            <button
              type="button"
              aria-label="Like"
              onClick={() => setLiked((value) => !value)}
              className={[
                "absolute top-4 right-4 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-main/10 bg-white transition hover:bg-background",
                liked ? "text-accent" : "text-main",
              ].join(" ")}
            >
              <ThumbsUp
                className="h-5 w-5"
                strokeWidth={2.2}
                fill={liked ? "currentColor" : "none"}
              />
            </button>
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

            <div className="mt-5 inline-flex h-10 items-center gap-4 rounded-full border border-main/15 bg-white px-4">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
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
                onClick={() => setQuantity((value) => Math.min(20, value + 1))}
                className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-main transition hover:bg-main/5"
              >
                <Plus className="h-4 w-4" strokeWidth={2.2} />
              </button>
            </div>

            {tableId ? (
              <p className="mt-3 text-xs text-main/45 sm:text-sm">
                Table {tableId}
              </p>
            ) : null}

            <div className="mt-8">
              <OrderTimeline activeStep="received" />
            </div>

            <div className="mt-8 flex flex-col items-center gap-2">
              <Button
                type="button"
                variant="accent"
                className="max-w-none w-full sm:max-w-sm"
                onClick={() => setNotified(true)}
              >
                {notified ? "Notifications on" : "Get Notified When Ready"}
              </Button>
              <p className="text-sm text-main/50">
                {notified
                  ? "We’ll ping you when it’s ready."
                  : "12:04 Till ready ..."}
              </p>
            </div>

            <div className="mt-8 rounded-[1.35rem] border border-main/10 bg-white px-4 py-5 text-center">
              <p className="text-sm leading-relaxed text-main/60 sm:text-[0.95rem]">
                When you’re ready to leave, review everything you consumed and
                settle your bill securely.
              </p>
              <div className="mt-4 flex justify-center">
                <Button
                  href={`/bill?meal=${encodeURIComponent(meal.id)}&qty=${quantity}${
                    tableId ? `&table=${encodeURIComponent(tableId)}` : ""
                  }`}
                  variant="main"
                  className="max-w-none w-full sm:max-w-sm"
                >
                  View your payment
                </Button>
              </div>
              <p className="mt-3 text-xs text-main/45">
                Continues to your bill summary, then checkout
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
