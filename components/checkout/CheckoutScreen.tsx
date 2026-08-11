"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Banknote,
  ChevronLeft,
  CreditCard,
  ShoppingCart,
} from "lucide-react";
import { AppNav } from "@/components/layout/AppNav";
import { IremboPayModal } from "@/components/checkout/IremboPayModal";
import { Button } from "@/components/ui/Button";
import { formatMoney, orderQuery, type BillSummary } from "@/lib/billing";

type CheckoutScreenProps = {
  bill: BillSummary;
  tableId?: string;
};

type LocalMethod = "card" | "cash";

export function CheckoutScreen({ bill, tableId }: CheckoutScreenProps) {
  const router = useRouter();
  const [method, setMethod] = useState<LocalMethod>("card");
  const [payOpen, setPayOpen] = useState(false);

  const primary = bill.lines[0];
  const billHref = primary
    ? `/bill?${orderQuery({
        mealId: primary.meal.id,
        quantity: primary.quantity,
        tableId,
      })}`
    : "/menu";

  const invoiceNumber = useMemo(() => {
    const stamp = Date.now().toString().slice(-6);
    return `YOT-${stamp}`;
  }, []);

  const startPayment = () => {
    if (method === "cash") {
      router.push(
        primary
          ? `/orders/${primary.meal.id}?qty=${primary.quantity}${
              tableId ? `&table=${encodeURIComponent(tableId)}` : ""
            }`
          : "/menu",
      );
      return;
    }
    setPayOpen(true);
  };

  return (
    <div className="min-h-dvh bg-background text-main">
      <AppNav active="bill" />

      <main className="mx-auto w-full max-w-lg px-4 pt-4 pb-28 sm:px-6 lg:pt-28 lg:pb-12">
        <header className="relative mb-6 flex items-center justify-center">
          <Link
            href={billHref}
            aria-label="Back"
            className="absolute left-0 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-main/10 bg-white text-main"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2.2} />
          </Link>
          <h1 className="text-xl font-bold tracking-tight">Checkout</h1>
          <span className="absolute right-0 inline-flex h-10 w-10 items-center justify-center rounded-full border border-main/10 bg-white text-main">
            <ShoppingCart className="h-4 w-4" strokeWidth={2.1} />
          </span>
        </header>

        {/* Stepper */}
        <ol className="mb-7 flex items-center justify-between px-1">
          {[
            { label: "Scan", done: true },
            { label: "Order", done: true },
            { label: "Payment", done: false },
          ].map((step, index, list) => (
            <li key={step.label} className="relative flex flex-1 flex-col items-center">
              {index < list.length - 1 ? (
                <span
                  aria-hidden
                  className={`absolute top-2.5 left-1/2 h-0.5 w-full ${
                    step.done ? "bg-accent" : "bg-main/15"
                  }`}
                />
              ) : null}
              <span
                className={[
                  "relative z-10 h-5 w-5 rounded-full border-2",
                  step.done || index === 2
                    ? "border-accent bg-accent"
                    : "border-main/20 bg-white",
                  index === 2 ? "bg-white" : "",
                ].join(" ")}
              />
              <span
                className={[
                  "mt-2 text-xs font-semibold",
                  step.done || index === 2 ? "text-main" : "text-main/35",
                ].join(" ")}
              >
                {step.label}
              </span>
            </li>
          ))}
        </ol>

        <div className="mb-6 flex items-start justify-between gap-4">
          <p className="text-lg font-bold">For payment:</p>
          <div className="text-right">
            <p className="text-2xl font-bold text-accent">
              {formatMoney(bill.totalRwf)}
            </p>
            <p className="mt-1 text-xs text-main/45">Including VAT (18%)</p>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-2 rounded-full border border-main/10 bg-white p-1">
          <button
            type="button"
            onClick={() => setMethod("card")}
            className={[
              "inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full text-sm font-semibold transition",
              method === "card"
                ? "bg-accent text-white"
                : "bg-transparent text-main/55",
            ].join(" ")}
          >
            <CreditCard className="h-4 w-4" strokeWidth={2.1} />
            IremboPay
          </button>
          <button
            type="button"
            onClick={() => setMethod("cash")}
            className={[
              "inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full text-sm font-semibold transition",
              method === "cash"
                ? "bg-accent text-white"
                : "bg-transparent text-main/55",
            ].join(" ")}
          >
            <Banknote className="h-4 w-4" strokeWidth={2.1} />
            Cash payment
          </button>
        </div>

        <div className="rounded-[1.35rem] border border-main/10 bg-white p-4">
          {method === "card" ? (
            <div className="space-y-2 text-sm text-main/60">
              <p className="font-semibold text-main">Pay with IremboPay</p>
              <p>
                You’ll complete payment in the IremboPay secure modal using MTN
                MoMo, Airtel Money, or card.
              </p>
              <ul className="mt-3 space-y-1.5 text-main/50">
                {bill.lines.map((line) => (
                  <li key={line.meal.id} className="flex justify-between gap-3">
                    <span>
                      {line.meal.name} × {line.quantity}
                    </span>
                    <span className="font-medium text-main">
                      {formatMoney(line.lineTotalRwf)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-main/60">
              Prefer cash? Confirm at the counter and our team will close your
              table bill manually.
            </p>
          )}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <Button
            type="button"
            variant="accent"
            className="max-w-none w-full"
            onClick={startPayment}
          >
            {method === "card" ? "Pay For Order" : "Confirm Cash Payment"}
          </Button>
          <p className="max-w-xs text-center text-xs leading-relaxed text-main/45">
            We will send you order details after a successful payment.
          </p>
        </div>
      </main>

      <IremboPayModal
        open={payOpen}
        amountRwf={bill.totalRwf}
        invoiceNumber={invoiceNumber}
        onClose={() => setPayOpen(false)}
        onSuccess={() => {
          setPayOpen(false);
          if (primary) {
            router.push(
              `/orders/${primary.meal.id}?qty=${primary.quantity}${
                tableId ? `&table=${encodeURIComponent(tableId)}` : ""
              }`,
            );
          }
        }}
      />
    </div>
  );
}
