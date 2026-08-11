import { notFound } from "next/navigation";
import { BillSummaryScreen } from "@/components/checkout/BillSummaryScreen";
import { buildBillSummary } from "@/lib/billing";

type BillPageProps = {
  searchParams: Promise<{ meal?: string; qty?: string; table?: string }>;
};

export default async function BillPage({ searchParams }: BillPageProps) {
  const { meal, qty, table } = await searchParams;

  if (!meal) notFound();

  const bill = buildBillSummary([
    { mealId: meal, quantity: Number(qty) || 1 },
  ]);

  if (!bill) notFound();

  return <BillSummaryScreen bill={bill} tableId={table} />;
}
