import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { formatRwf, type Meal } from "@/lib/menu-data";

type MealCardProps = {
  meal: Meal;
  tableId?: string;
  compact?: boolean;
};

export function MealCard({ meal, tableId, compact = false }: MealCardProps) {
  const href = tableId
    ? `/menu/${meal.id}?table=${encodeURIComponent(tableId)}`
    : `/menu/${meal.id}`;

  return (
    <article
      className={[
        "flex flex-col overflow-hidden rounded-[1.35rem] border border-main/10 bg-white",
        compact ? "" : "",
      ].join(" ")}
    >
      <Link href={href} className="relative block cursor-pointer overflow-hidden">
        <div className={compact ? "relative aspect-5/3" : "relative aspect-4/3"}>
          <Image
            src={meal.image}
            alt={meal.name}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 240px"
            className="object-cover transition duration-300 hover:scale-[1.02]"
          />
          <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded-full border border-main/10 bg-[#F5C542] px-2 py-1 text-[11px] font-semibold text-main">
            <Star className="h-3 w-3 fill-current" strokeWidth={0} />
            {meal.rating.toFixed(1)}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col px-3.5 pt-3 pb-3.5">
        <Link href={href} className="cursor-pointer">
          <h3 className="text-[0.95rem] font-bold text-main sm:text-base">
            {meal.name}
          </h3>
          <p className="mt-1 line-clamp-1 text-xs text-main/50 sm:text-sm">
            {meal.description}
          </p>
        </Link>

        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <p className="text-sm font-bold text-main sm:text-[0.95rem]">
            {formatRwf(meal.priceRwf)}
          </p>
          <Link
            href={href}
            className="inline-flex h-8 cursor-pointer items-center justify-center rounded-full border border-accent bg-accent px-3.5 text-xs font-semibold text-white transition hover:brightness-105 active:brightness-95 sm:h-9 sm:px-4 sm:text-sm"
          >
            Order
          </Link>
        </div>
      </div>
    </article>
  );
}
