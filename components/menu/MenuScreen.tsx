"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowUp, Search, Star } from "lucide-react";
import { YotLogo } from "@/components/branding/YotLogo";
import { AppNav } from "@/components/layout/AppNav";
import {
  FOOD_CATEGORIES,
  MEALS,
  MENU_TABS,
  PROMO,
  formatRwf,
  type Meal,
} from "@/lib/menu-data";

type MenuScreenProps = {
  tableId?: string;
};

function MealCard({ meal }: { meal: Meal }) {
  return (
    <article className="overflow-hidden rounded-[1.35rem] border border-main/10 bg-white">
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={meal.image}
          alt={meal.name}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 240px"
          className="object-cover"
        />
        <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded-full border border-main/10 bg-[#F5C542] px-2 py-1 text-[11px] font-semibold text-main">
          <Star className="h-3 w-3 fill-current" strokeWidth={0} />
          {meal.rating.toFixed(1)}
        </span>
      </div>

      <div className="relative px-3.5 pt-3 pb-4">
        <h3 className="text-[0.95rem] font-bold text-main sm:text-base">
          {meal.name}
        </h3>
        <p className="mt-1 line-clamp-1 text-xs text-main/50 sm:text-sm">
          {meal.description}
        </p>
        <div className="mt-3 flex items-end justify-between gap-2 pr-10">
          <p className="text-sm font-bold text-main sm:text-[0.95rem]">
            {formatRwf(meal.priceRwf)}
          </p>
        </div>
        <button
          type="button"
          aria-label={`Add ${meal.name}`}
          className="absolute right-3 bottom-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-main text-white transition hover:bg-main/90 active:scale-95"
        >
          <ArrowUp className="h-4 w-4" strokeWidth={2.4} />
        </button>
      </div>
    </article>
  );
}

export function MenuScreen({ tableId }: MenuScreenProps) {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const meals = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return MEALS.filter((meal) => {
      const matchesTab =
        activeTab === "all" ? true : meal.tabs.includes(activeTab);
      const matchesCategory = activeCategory
        ? meal.categories.includes(activeCategory)
        : true;
      const matchesQuery = normalized
        ? `${meal.name} ${meal.description}`.toLowerCase().includes(normalized)
        : true;

      return matchesTab && matchesCategory && matchesQuery;
    });
  }, [activeCategory, activeTab, query]);

  return (
    <div className="min-h-dvh bg-background text-main">
      <AppNav active="explore" />

      <main className="mx-auto w-full max-w-7xl px-4 pt-4 pb-28 sm:px-6 lg:px-8 lg:pt-28 lg:pb-12 xl:px-10">
        {/* Mobile header only — desktop uses the floating navbar */}
        <header className="relative flex items-center justify-center py-4 lg:hidden">
          <div className="absolute top-1/2 left-0 -translate-y-1/2">
            <YotLogo
              variant="mark"
              tone="brand"
              className="h-11 w-11"
              priority
            />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight">The Yot</h1>
            {tableId ? (
              <p className="text-xs font-medium text-main/50">Table {tableId}</p>
            ) : null}
          </div>
        </header>

        {tableId ? (
          <p className="mb-4 hidden text-sm text-main/55 lg:block">
            Table {tableId} · browse & order from your seat
          </p>
        ) : null}

        {/* Search */}
        <div className="relative">
          <label htmlFor="menu-search" className="sr-only">
            Search dish
          </label>
          <span className="pointer-events-none absolute top-1/2 left-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-main/5 text-main/55">
            <Search className="h-4 w-4" strokeWidth={2.2} />
          </span>
          <input
            id="menu-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Dish...."
            className="h-12 w-full rounded-full border border-main/15 bg-white pr-4 pl-14 text-sm text-main outline-none placeholder:text-main/35 focus:border-accent focus:ring-2 focus:ring-accent/30 lg:h-14 lg:text-base"
          />
        </div>

        {/* Text tabs */}
        <div className="mt-5 -mx-4 overflow-x-auto px-4 sm:-mx-0 sm:px-0 lg:mt-7">
          <div className="flex min-w-max items-center gap-5 sm:gap-7">
            {MENU_TABS.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={[
                    "relative cursor-pointer pb-2 text-sm font-semibold capitalize transition-colors sm:text-base",
                    isActive ? "text-main" : "text-main/40 hover:text-main/70",
                  ].join(" ")}
                >
                  {tab.label}
                  {isActive ? (
                    <span className="absolute inset-x-0 -bottom-0.5 mx-auto h-0.5 w-full rounded-full bg-main" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Circular categories */}
        <div className="mt-5 -mx-4 overflow-x-auto px-4 sm:-mx-0 sm:px-0 lg:mt-6">
          <div className="flex min-w-max gap-4 sm:gap-5 lg:gap-6">
            {FOOD_CATEGORIES.map((category) => {
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() =>
                    setActiveCategory((current) =>
                      current === category.id ? null : category.id,
                    )
                  }
                  className="flex w-[4.75rem] cursor-pointer flex-col items-center gap-2 sm:w-24"
                >
                  <span
                    className={[
                      "relative h-[4.75rem] w-[4.75rem] overflow-hidden rounded-full border-2 transition sm:h-24 sm:w-24",
                      isActive
                        ? "border-accent"
                        : "border-transparent",
                    ].join(" ")}
                  >
                    <Image
                      src={category.image}
                      alt={category.label}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </span>
                  <span className="text-xs font-medium text-main sm:text-sm">
                    {category.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Promo banner */}
        <section className="relative mt-6 overflow-hidden rounded-[1.75rem] sm:mt-8 lg:rounded-[2rem]">
          <div className="relative aspect-[16/9] min-h-[9.5rem] w-full sm:aspect-[21/8] sm:min-h-[11rem] lg:min-h-[13rem]">
            <Image
              src={PROMO.image}
              alt="Promo"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-start justify-center gap-3 px-5 sm:gap-4 sm:px-8 lg:px-10">
              <p className="max-w-[11rem] text-xl leading-tight font-bold text-white sm:max-w-xs sm:text-3xl lg:text-4xl">
                {PROMO.title}
              </p>
              <button
                type="button"
                className="cursor-pointer rounded-full border border-main/10 bg-white px-5 py-2 text-sm font-semibold text-main transition hover:bg-background"
              >
                {PROMO.cta}
              </button>
            </div>
          </div>
        </section>

        {/* Meals */}
        <section className="mt-7 sm:mt-9">
          <h2 className="text-lg font-bold sm:text-xl">Available Meals</h2>

          {meals.length === 0 ? (
            <p className="mt-6 text-sm text-main/50">No dishes match your filters.</p>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
              {meals.map((meal) => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
