import { StockProvider } from "@/components/staff/stock/StockProvider";
import type { ReactNode } from "react";

export default function StockLayout({ children }: { children: ReactNode }) {
  return <StockProvider>{children}</StockProvider>;
}
