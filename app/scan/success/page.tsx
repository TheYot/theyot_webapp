import { ScanSuccessScreen } from "@/components/scan/ScanSuccessScreen";

type ScanSuccessPageProps = {
  searchParams: Promise<{ table?: string }>;
};

export default async function ScanSuccessPage({
  searchParams,
}: ScanSuccessPageProps) {
  const { table } = await searchParams;

  return <ScanSuccessScreen tableId={table} />;
}
