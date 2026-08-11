import Link from "next/link";

type NavItem = {
  href: string;
  label: string;
  id: "explore" | "booking" | "scan" | "orders" | "profile";
};

const NAV_ITEMS: NavItem[] = [
  { id: "explore", href: "/menu", label: "Explore" },
  { id: "booking", href: "/menu", label: "Booking" },
  { id: "scan", href: "/scan", label: "Scan" },
  { id: "orders", href: "/menu", label: "Orders" },
  { id: "profile", href: "/menu", label: "Profile" },
];

function ExploreIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4.5 10.5 12 4l7.5 6.5V20a1 1 0 0 1-1 1h-4.5v-5.5h-4V21H5.5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BookingIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect
        x="4"
        y="5"
        width="16"
        height="15"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8 3.5v3M16 3.5v3M4 9.5h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ScanIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M7 8V6.5A1.5 1.5 0 0 1 8.5 5H10M17 8V6.5A1.5 1.5 0 0 0 15.5 5H14M7 16v1.5A1.5 1.5 0 0 0 8.5 19H10M17 16v1.5a1.5 1.5 0 0 1-1.5 1.5H14M8 12h8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function OrdersIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 8v4.2l2.8 1.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProfileIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="9" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M6.5 18.2c1.4-2.2 3.3-3.3 5.5-3.3s4.1 1.1 5.5 3.3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

const ICONS = {
  explore: ExploreIcon,
  booking: BookingIcon,
  scan: ScanIcon,
  orders: OrdersIcon,
  profile: ProfileIcon,
} as const;

type AppNavProps = {
  active?: NavItem["id"];
};

export function AppNav({ active = "explore" }: AppNavProps) {
  return (
    <>
      {/* Desktop / large screens — top navbar */}
      <nav className="sticky top-0 z-40 hidden border-b border-main/10 bg-background/95 backdrop-blur-md lg:block">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-8 py-4 xl:px-10">
          <Link href="/menu" className="text-lg font-bold tracking-tight text-main">
            The Yot
          </Link>
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = ICONS[item.id];
              const isActive = item.id === active;
              const isScan = item.id === "scan";

              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={[
                      "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      isScan
                        ? "bg-main text-white hover:bg-main/90"
                        : isActive
                          ? "bg-main/10 text-main"
                          : "text-main/70 hover:bg-main/5 hover:text-main",
                    ].join(" ")}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile / tablet — bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-main/10 bg-white/95 px-2 pt-2 pb-[max(0.55rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
        <ul className="mx-auto grid max-w-lg grid-cols-5 items-end">
          {NAV_ITEMS.map((item) => {
            const Icon = ICONS[item.id];
            const isActive = item.id === active;
            const isScan = item.id === "scan";

            if (isScan) {
              return (
                <li key={item.id} className="flex justify-center">
                  <Link
                    href={item.href}
                    className="-mt-7 flex flex-col items-center gap-1"
                    aria-label="Scan"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-main text-white shadow-[0_10px_24px_rgba(78,58,37,0.35)]">
                      <Icon className="h-6 w-6" />
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
                    "flex flex-col items-center gap-1 px-1 py-1",
                    isActive ? "text-main" : "text-main/45",
                  ].join(" ")}
                >
                  <Icon className="h-5 w-5" />
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
