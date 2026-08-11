import { notFound } from "next/navigation";
import { ProductDetailScreen } from "@/components/menu/ProductDetailScreen";
import { getMealById } from "@/lib/menu-data";

type ProductPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ table?: string }>;
};

export default async function ProductPage({
  params,
  searchParams,
}: ProductPageProps) {
  const { id } = await params;
  const { table } = await searchParams;
  const meal = getMealById(id);

  if (!meal) notFound();

  return <ProductDetailScreen meal={meal} tableId={table} />;
}
