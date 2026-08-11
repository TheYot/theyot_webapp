import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  Home,
  ReceiptText,
  ScanLine,
  type LucideIcon,
} from "lucide-react";
import { YotLogo } from "@/components/branding/YotLogo";

type NavItem = {
  href: string;
  label: string;
  id: "explore" | "booking" | "scan" | "orders" | "bill";
  icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
  { id: "explore", href: "/menu", label: "Explore", icon: Home },
  { id: "booking", href: "/menu", label: "Booking", icon: CalendarDays },
  { id: "scan", href: "/scan", label: "Scan", icon: ScanLine },
  { id: "orders", href: "/menu", label: "Orders", icon: Clock3 },
  { id: "bill", href: "/bill", label: "Bill", icon: ReceiptText },
];

const DESKTOP_LINKS = NAV_ITEMS.filter((item) => item.id !== "scan");

type AppNavProps = {
  active?: NavItem["id"];
};

export function AppNav({ active = "explore" }: AppNavProps) {
  return (
    <>
      {/* Desktop — fixed floating glassy pill */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 hidden lg:block">
        <div className="pointer-events-auto mx-auto mt-5 w-[min(920px,calc(100%-3rem))] xl:w-[min(1040px,calc(100%-4rem))]">
          <nav className="flex items-center justify-between gap-3 rounded-full border border-main/12 bg-white/70 px-2.5 py-2 backdrop-blur-2xl">
            <Link
              href="/menu"
              className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-3 py-1.5"
            >
              <YotLogo variant="mark" tone="brand" className="h-8 w-8" />
              <span className="text-[0.95rem] font-bold tracking-tight text-main">
                The Yot
              </span>
            </Link>

            <ul className="flex flex-1 items-center justify-center gap-0.5">
              {DESKTOP_LINKS.map((item) => {
                const Icon = item.icon;
                const isActive = item.id === active;

                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={[
                        "relative inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "text-main"
                          : "text-main/40 hover:text-main/70",
                      ].join(" ")}
                    >
                      <Icon className="h-4 w-4" strokeWidth={2.1} />
                      {item.label}
                      {isActive ? (
                        <span className="absolute inset-x-3.5 bottom-1 h-px rounded-full bg-main" />
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <Link
              href="/scan"
              className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-main bg-main px-4 py-2 text-sm font-semibold text-white transition hover:bg-main/90"
            >
              <ScanLine className="h-4 w-4" strokeWidth={2.2} />
              Scan
            </Link>
          </nav>
        </div>
      </header>

      {/* Mobile / tablet — bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-main/10 bg-white/90 px-2 pt-2 pb-[max(0.55rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden">
        <ul className="mx-auto grid max-w-lg grid-cols-5 items-end">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === active;
            const isScan = item.id === "scan";

            if (isScan) {
              return (
                <li key={item.id} className="flex justify-center">
                  <Link
                    href={item.href}
                    className="-mt-7 flex cursor-pointer flex-col items-center gap-1"
                    aria-label="Scan"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-main bg-main text-white">
                      <Icon className="h-6 w-6" strokeWidth={2.2} />
                    </span>
                    <span className="text-[11px] font-medium text-main">
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            }

            return (
              <li key={item.id} className="flex justify-center">
                <Link
                  href={item.href}
                  className={[
                    "flex cursor-pointer flex-col items-center gap-1 px-1 py-1",
                    isActive ? "text-main" : "text-main/45",
                  ].join(" ")}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.1} />
                  <span className="text-[11px] font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
