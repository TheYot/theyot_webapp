import { BriefcaseBusiness, UtensilsCrossed } from "lucide-react";
import { YotLogo } from "@/components/branding/YotLogo";
import { Button } from "@/components/ui/Button";

export function WelcomeScreen() {
  return (
    <main className="min-h-dvh bg-main lg:grid lg:grid-cols-2">
      {/* Brand panel — full on mobile, left half on desktop */}
      <section className="relative flex flex-col items-center justify-center px-6 py-12 sm:px-8 lg:min-h-dvh lg:px-12 xl:px-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(196,166,117,0.14)_0%,transparent_62%)]"
        />
        <div className="welcome-logo-enter relative z-10 w-[min(78vw,22rem)] sm:w-[min(70vw,26rem)] lg:w-full lg:max-w-md xl:max-w-lg">
          <YotLogo variant="wordmark" className="h-auto w-full" priority />
        </div>

        {/* Mobile-only CTAs under logo */}
        <div className="welcome-cta-enter relative z-10 mt-10 w-full max-w-sm space-y-4 text-center lg:hidden">
          <p className="text-sm text-white/65 sm:text-base">
            How would you like to continue?
          </p>
          <div className="flex flex-col gap-3">
            <Button href="/scan" variant="accent" className="max-w-none w-full gap-2">
              <UtensilsCrossed className="h-4 w-4" strokeWidth={2.2} />
              Continue as Guest
            </Button>
            <Button
              href="/staff/login"
              variant="outline"
              className="max-w-none w-full gap-2 border-white/35 text-white hover:bg-white/10"
            >
              <BriefcaseBusiness className="h-4 w-4" strokeWidth={2.2} />
              Staff Portal
            </Button>
          </div>
          <p className="text-xs text-white/45">
            Guests order & pay from the table · Staff manage operations
          </p>
        </div>
      </section>

      {/* Content panel — desktop only */}
      <section className="hidden items-center justify-center bg-white px-10 py-16 lg:flex xl:px-16">
        <div className="welcome-cta-enter w-full max-w-md">
          <h1 className="text-3xl font-bold tracking-tight text-main xl:text-4xl">
            Welcome to The YOT
          </h1>
          <p className="mt-3 text-base text-main/55">
            How would you like to continue?
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <Button
              href="/scan"
              variant="accent"
              className="max-w-none h-14 w-full gap-2 text-base"
            >
              <UtensilsCrossed className="h-4 w-4" strokeWidth={2.2} />
              Continue as Guest
            </Button>
            <Button
              href="/staff/login"
              variant="outline"
              className="max-w-none h-14 w-full gap-2 border-main/20 text-main hover:bg-main/5 text-base"
            >
              <BriefcaseBusiness className="h-4 w-4" strokeWidth={2.2} />
              Staff Portal
            </Button>
          </div>

          <p className="mt-6 text-sm leading-relaxed text-main/45">
            Guests order & pay from the table · Staff manage operations
          </p>
        </div>
      </section>
    </main>
  );
}
