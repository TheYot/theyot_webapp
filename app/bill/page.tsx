import Link from "next/link";
import { ReceiptText } from "lucide-react";
import { AppNav } from "@/components/layout/AppNav";
import { BillSummaryScreen } from "@/components/checkout/BillSummaryScreen";
import { Button } from "@/components/ui/Button";
import { buildBillSummary } from "@/lib/billing";

type BillPageProps = {
  searchParams: Promise<{ meal?: string; qty?: string; table?: string }>;
};

export default async function BillPage({ searchParams }: BillPageProps) {
  const { meal, qty, table } = await searchParams;

  if (meal) {
    const bill = buildBillSummary([
      { mealId: meal, quantity: Number(qty) || 1 },
    ]);

    if (bill) {
      return <BillSummaryScreen bill={bill} tableId={table} />;
    }
  }

  return (
    <div className="min-h-dvh bg-background text-main">
      <AppNav active="bill" />
      <main className="mx-auto flex w-full max-w-md flex-col items-center px-6 pt-16 pb-28 text-center lg:pt-36">
        <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full border border-main/10 bg-white text-main">
          <ReceiptText className="h-6 w-6" strokeWidth={2.1} />
        </span>
        <h1 className="text-2xl font-bold tracking-tight">No open bill yet</h1>
        <p className="mt-3 text-sm leading-relaxed text-main/55">
          Order from the menu first, then you can review what you consumed and
          pay from here — no account needed.
        </p>
        <div className="mt-7 w-full">
          <Button href="/menu" variant="accent" className="max-w-none w-full">
            Browse menu
          </Button>
        </div>
        <Link
          href="/scan"
          className="mt-4 cursor-pointer text-sm font-medium text-main/55 underline-offset-2 hover:text-main hover:underline"
        >
          Or scan your table
        </Link>
      </main>
    </div>
  );
}
