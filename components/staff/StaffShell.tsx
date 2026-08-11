"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useState, type ReactNode } from "react";
import {
  Bell,
  Boxes,
  ClipboardList,
  Home,
  LogOut,
  Menu,
  Settings,
  UtensilsCrossed,
  Wine,
  X,
  type LucideIcon,
} from "lucide-react";
import { YotLogo } from "@/components/branding/YotLogo";

type StaffSession = {
  id: string;
  name: string;
  role: string;
  roleLabel: string;
};

type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  match?: "exact" | "prefix";
};

const PRIMARY_LINKS: NavLink[] = [
  { href: "/staff/stock", label: "Home", icon: Home, match: "exact" },
  {
    href: "/staff/stock/inventory",
    label: "Inventory",
    icon: Boxes,
    match: "exact",
  },
  {
    href: "/staff/stock/menu",
    label: "Menu items",
    icon: UtensilsCrossed,
    match: "exact",
  },
  {
    href: "/staff/stock/usage",
    label: "Usage",
    icon: ClipboardList,
    match: "exact",
  },
  {
    href: "/staff/stock/liquor",
    label: "Liquor scanner",
    icon: Wine,
    match: "exact",
  },
];

const SYSTEM_LINKS: NavLink[] = [
  { href: "/staff/stock#settings", label: "Settings", icon: Settings },
];

type StaffShellProps = {
  children: ReactNode;
  title: string;
  subtitle?: string;
};

function isActiveLink(
  pathname: string,
  href: string,
  match?: "exact" | "prefix",
) {
  const pathOnly = href.split("#")[0];
  if (match === "prefix") return pathname.startsWith(pathOnly);
  return pathname === pathOnly && !href.includes("#");
}

export function StaffShell({ children, title, subtitle }: StaffShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const drawerId = useId();
  const [session, setSession] = useState<StaffSession | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  useEffect(() => {
    const raw = window.sessionStorage.getItem("yot-staff");
    if (!raw) {
      router.replace("/staff/login");
      return;
    }
    try {
      setSession(JSON.parse(raw) as StaffSession);
    } catch {
      router.replace("/staff/login");
    }
  }, [router]);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Lock page scroll — only the right content pane scrolls.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    if (!drawerOpen && !logoutOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (logoutOpen) setLogoutOpen(false);
      else if (drawerOpen) setDrawerOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen, logoutOpen]);

  const requestLogout = () => {
    setDrawerOpen(false);
    setLogoutOpen(true);
  };

  const confirmLogout = () => {
    window.sessionStorage.removeItem("yot-staff");
    setLogoutOpen(false);
    router.push("/staff/login");
  };

  if (!session) {
    return (
      <div className="flex h-dvh items-center justify-center bg-background text-sm text-main/50">
        Checking staff access...
      </div>
    );
  }

  const renderNavGroup = (
    label: string,
    links: NavLink[],
    onNavigate?: () => void,
  ) => (
    <div className="space-y-1">
      <p className="px-4 pb-1 text-[11px] font-semibold tracking-[0.14em] text-white/35 uppercase">
        {label}
      </p>
      {links.map((link) => {
        const Icon = link.icon;
        const active = isActiveLink(pathname, link.href, link.match);
        return (
          <Link
            key={`${label}-${link.label}`}
            href={link.href}
            onClick={onNavigate}
            className={[
              "flex cursor-pointer items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition",
              active
                ? "bg-white text-main"
                : "text-white/75 hover:bg-white/10 hover:text-white",
            ].join(" ")}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={2.1} />
            {link.label}
          </Link>
        );
      })}
    </div>
  );

  const sidebarContent = (onNavigate?: () => void) => (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-5 py-5">
        <div className="flex min-w-0 items-center gap-3">
          <YotLogo variant="mark" className="h-10 w-10 shrink-0" />
          <div className="min-w-0">
            <p className="text-lg font-bold tracking-wide">YOT</p>
            <p className="truncate text-xs text-white/55">{session.roleLabel}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setDrawerOpen(false)}
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-white/15 text-white lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" strokeWidth={2.2} />
        </button>
      </div>

      <nav className="min-h-0 flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {renderNavGroup("Main", PRIMARY_LINKS, onNavigate)}
        {renderNavGroup("System", SYSTEM_LINKS, onNavigate)}
      </nav>

      <div className="shrink-0 border-t border-white/10 p-3">
        <div className="mb-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
          <p className="truncate text-sm font-semibold text-white">
            {session.name}
          </p>
          <p className="truncate text-xs text-white/45">{session.roleLabel}</p>
        </div>
        <button
          type="button"
          onClick={requestLogout}
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-4 w-4" strokeWidth={2.1} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-dvh overflow-hidden bg-background text-main">
      {/* Desktop fixed sidebar — never scrolls with page */}
      <aside className="hidden h-full w-64 shrink-0 border-r border-white/10 bg-main text-white lg:flex lg:flex-col xl:w-72">
        {sidebarContent()}
      </aside>

      {/* Mobile drawer */}
      <div
        className={[
          "fixed inset-0 z-50 lg:hidden",
          drawerOpen ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
      >
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setDrawerOpen(false)}
          className={[
            "absolute inset-0 cursor-pointer bg-black/45 transition-opacity duration-300",
            drawerOpen ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />
        <aside
          id={drawerId}
          className={[
            "absolute top-0 left-0 flex h-full w-[min(20rem,86vw)] flex-col bg-main text-white transition-transform duration-300 ease-out",
            drawerOpen ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          {sidebarContent(() => setDrawerOpen(false))}
        </aside>
      </div>

      {/* Right pane — header fixed, content scrolls */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="shrink-0 border-b border-main/10 bg-background">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-main/10 bg-white text-main lg:hidden"
                aria-label="Open menu"
                aria-expanded={drawerOpen}
                aria-controls={drawerId}
                onClick={() => setDrawerOpen(true)}
              >
                <Menu className="h-5 w-5" strokeWidth={2.2} />
              </button>
              <div className="min-w-0">
                <h1 className="truncate text-lg font-bold tracking-tight sm:text-xl">
                  {title}
                </h1>
                {subtitle ? (
                  <p className="hidden truncate text-sm text-main/50 sm:block">
                    {subtitle}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-main/10 bg-white text-main"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" strokeWidth={2.1} />
              </button>
              <div className="hidden rounded-full border border-main/10 bg-white px-3 py-1.5 text-sm md:block">
                {session.name}
              </div>
            </div>
          </div>
          {subtitle ? (
            <p className="border-t border-main/10 px-4 py-2 text-sm text-main/50 sm:hidden">
              {subtitle}
            </p>
          ) : null}
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          {children}
        </div>
      </div>

      {logoutOpen ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 px-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-title"
        >
          <div className="w-full max-w-sm rounded-2xl border border-main/10 bg-white p-5 text-center sm:p-6">
            <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-main/10 bg-background text-main">
              <LogOut className="h-5 w-5" strokeWidth={2.1} />
            </div>
            <h2
              id="logout-title"
              className="text-lg font-bold tracking-tight text-main"
            >
              Log out?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-main/55">
              Are you sure you want to logout?
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLogoutOpen(false)}
                className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full border border-main/15 bg-white text-sm font-semibold text-main transition hover:bg-main/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full border border-main bg-main text-sm font-semibold text-white transition hover:bg-main/90"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
