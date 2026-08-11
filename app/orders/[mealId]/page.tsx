import { notFound } from "next/navigation";
import { OrderTrackingScreen } from "@/components/order/OrderTrackingScreen";
import { getMealById } from "@/lib/menu-data";

type OrderTrackPageProps = {
  params: Promise<{ mealId: string }>;
  searchParams: Promise<{ qty?: string; table?: string }>;
};

export default async function OrderTrackPage({
  params,
  searchParams,
}: OrderTrackPageProps) {
  const { mealId } = await params;
  const { qty, table } = await searchParams;
  const meal = getMealById(mealId);

  if (!meal) notFound();

  const quantity = Math.min(20, Math.max(1, Number(qty) || 1));

  return (
    <OrderTrackingScreen
      meal={meal}
      initialQuantity={quantity}
      tableId={table}
    />
  );
}
