import { notFound } from "next/navigation";
import { CheckoutScreen } from "@/components/checkout/CheckoutScreen";
import { buildBillSummary } from "@/lib/billing";

type CheckoutPageProps = {
  searchParams: Promise<{ meal?: string; qty?: string; table?: string }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const { meal, qty, table } = await searchParams;

  if (!meal) notFound();

  const bill = buildBillSummary([
    { mealId: meal, quantity: Number(qty) || 1 },
  ]);

  if (!bill) notFound();

  return <CheckoutScreen bill={bill} tableId={table} />;
}
