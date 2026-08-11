import { YotLogo } from "@/components/branding/YotLogo";
import { Button } from "@/components/ui/Button";

export function WelcomeScreen() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-main px-6 py-10 sm:px-8 md:px-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(196,166,117,0.14)_0%,transparent_62%)]"
      />

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center gap-10 sm:max-w-xl sm:gap-12 md:max-w-2xl md:gap-14">
        <div className="welcome-logo-enter w-[min(78vw,22rem)] sm:w-[min(70vw,26rem)] md:w-[28rem]">
          <YotLogo variant="wordmark" priority />
        </div>

        <div className="welcome-cta-enter flex w-full justify-center">
          <Button href="/scan">Get Started</Button>
        </div>
      </div>
    </main>
  );
}
