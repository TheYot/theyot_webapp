"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ReceiptText } from "lucide-react";
import { AppNav } from "@/components/layout/AppNav";
import { Button } from "@/components/ui/Button";
import { formatMoney, orderQuery, type BillSummary } from "@/lib/billing";

type BillSummaryScreenProps = {
  bill: BillSummary;
  tableId?: string;
};

export function BillSummaryScreen({ bill, tableId }: BillSummaryScreenProps) {
  const primary = bill.lines[0];
  const checkoutHref = primary
    ? `/checkout?${orderQuery({
        mealId: primary.meal.id,
        quantity: primary.quantity,
        tableId,
      })}`
    : "/menu";

  const trackBack = primary
    ? `/orders/${primary.meal.id}?qty=${primary.quantity}${
        tableId ? `&table=${encodeURIComponent(tableId)}` : ""
      }`
    : "/menu";

  return (
    <div className="min-h-dvh bg-background text-main">
      <AppNav active="bill" />

      <main className="mx-auto w-full max-w-2xl px-4 pt-4 pb-28 sm:px-6 lg:max-w-3xl lg:pt-28 lg:pb-12">
        <header className="relative mb-6 flex items-center justify-center lg:mb-8">
          <Link
            href={trackBack}
            aria-label="Back"
            className="absolute left-0 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-main/10 bg-white text-main"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2.2} />
          </Link>
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              Your bill
            </h1>
            <p className="mt-1 text-sm text-main/50">
              Review what you consumed before checkout
            </p>
          </div>
        </header>

        <section className="rounded-[1.5rem] border border-main/10 bg-white p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-2 text-main/55">
            <ReceiptText className="h-4 w-4" strokeWidth={2.1} />
            <p className="text-sm font-medium">
              {tableId ? `Table ${tableId}` : "Guest order"}
            </p>
          </div>

          <ul className="divide-y divide-main/10">
            {bill.lines.map((line) => (
              <li
                key={line.meal.id}
                className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-main/10 sm:h-16 sm:w-16">
                  <Image
                    src={line.meal.image}
                    alt={line.meal.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{line.meal.name}</p>
                  <p className="mt-0.5 text-sm text-main/50">
                    {formatMoney(line.unitPriceRwf)} × {line.quantity}
                  </p>
                </div>
                <p className="shrink-0 font-bold">
                  {formatMoney(line.lineTotalRwf)}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-4 rounded-[1.5rem] border border-main/10 bg-white p-4 sm:p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-main/55">Subtotal</span>
            <span className="font-medium">{formatMoney(bill.subtotalRwf)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-main/55">
              VAT ({Math.round(bill.vatRate * 100)}%)
            </span>
            <span className="font-medium">{formatMoney(bill.vatRwf)}</span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-main/10 pt-4">
            <span className="text-base font-bold">Total</span>
            <span className="text-lg font-bold text-accent sm:text-xl">
              {formatMoney(bill.totalRwf)}
            </span>
          </div>
        </section>

        <p className="mt-5 text-center text-sm leading-relaxed text-main/50">
          Ready to settle your bill? Continue to checkout to pay securely with
          IremboPay.
        </p>

        <div className="mt-5 flex justify-center">
          <Button
            href={checkoutHref}
            variant="accent"
            className="max-w-none w-full sm:max-w-sm"
          >
            Continue to checkout
          </Button>
        </div>
      </main>
    </div>
  );
}
