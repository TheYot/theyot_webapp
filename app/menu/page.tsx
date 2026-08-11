import { MenuScreen } from "@/components/menu/MenuScreen";

type MenuPageProps = {
  searchParams: Promise<{ table?: string }>;
};

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const { table } = await searchParams;

  return <MenuScreen tableId={table} />;
}
